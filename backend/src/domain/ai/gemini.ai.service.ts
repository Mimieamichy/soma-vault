// services/ai.service.ts
import { StudyFragment } from '@prisma/client';
import { GoogleGenAI } from "@google/genai";
import prisma from "../../lib/prisma";

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const genAI = new GoogleGenAI({});

interface GenerateSummaryInput {
  content: string;
  fragmentNumber: number;
  totalFragments: number;
}

interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer?: string;
}

class AIService {
  async generateFragmentSummary(input: GenerateSummaryInput): Promise<string> {
    const { content, fragmentNumber, totalFragments } = input;

    const prompt = `You are a study assistant helping students break down study materials.

Fragment ${fragmentNumber} of ${totalFragments}

Content:
${content}

Generate a clear, concise summary (150-200 words) that:
1. Highlights the main concepts and key points
2. Uses simple, easy-to-understand language
3. Focuses on what students need to know
4. Organizes information logically

    Return only the summary text, no additional formatting.`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview", 
        contents: prompt,
      });
      const summary = response.text || "Summary could not be generated for this fragment.";

      return summary.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      // Return a basic summary instead of throwing
      return `Fragment ${fragmentNumber}: ${content.substring(0, 200)}...`;
    }
  }

  async generateQuestions(content: string, count: number = 5): Promise<Question[]> {
    const prompt = `Based on the following study content, generate exactly ${count} practice questions.

Study Content:
${content}

Requirements:
- Generate 4 multiple choice questions with 4 options each
- Generate 1 true/false questions
- Questions should test understanding, not just memorization

Return ONLY a valid JSON array with NO markdown formatting, NO code blocks, NO explanation.
Use this EXACT format:

[
  {
    "question": "What is the main purpose of AfriHackBox?",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  },
  {
    "question": "True or False: The competition lasted for 2 days.",
    "type": "true_false",
    "options": ["True", "False"],
    "correctAnswer": "True"
  }
]`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
      });
      
      let textContent = (response.text || "").trim();
      
      // Remove markdown code blocks
      textContent = textContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove any leading/trailing whitespace
      textContent = textContent.trim();

      console.log('Raw AI response:', textContent.substring(0, 200));

      const questions = JSON.parse(textContent) as Question[];

      // Validate structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format');
      }

      // Validate each question
      const validQuestions = questions.filter(q => 
        q.question && 
        q.type && 
        ['multiple_choice', 'true_false', 'short_answer'].includes(q.type)
      );

      if (validQuestions.length === 0) {
        throw new Error('No valid questions generated');
      }

      return validQuestions.slice(0, count);
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback to content-based questions
      return this.generateFallbackQuestions(content, count);
    }
  }

  private generateFallbackQuestions(content: string, count: number): Question[] {
    const questions: Question[] = [
      {
        question: 'What is the main topic discussed in this section?',
        type: 'short_answer',
        correctAnswer: 'Based on the study material provided'
      },
      {
        question: 'This section contains important information relevant to the overall topic.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True'
      },
      {
        question: 'Which of the following best describes the content of this section?',
        type: 'multiple_choice',
        options: [
          'Introduction to the topic',
          'Detailed analysis',
          'Conclusion and summary',
          'Supporting examples'
        ],
        correctAnswer: 'Detailed analysis'
      }
    ];

    return questions.slice(0, count);
  }

  async processFragmentWithAI(fragmentId: string) {
    try {
      const fragment = await prisma.studyFragment.findUnique({
        where: { id: fragmentId },
        include: {
          studyPlan: {
            include: {
              fragments: {
                select: { id: true }
              }
            }
          }
        }
      });

      if (!fragment) {
        throw new Error('Fragment not found');
      }

      console.log(`Processing fragment ${fragment.fragmentNumber}...`);

      // Generate summary & questions in parallel
      const [summary, questions] = await Promise.all([
        this.generateFragmentSummary({
          content: fragment.content,
          fragmentNumber: fragment.fragmentNumber,
          totalFragments: fragment.studyPlan.fragments.length
        }),
        this.generateQuestions(fragment.content, 5)
      ]);

      console.log(`Generated ${questions.length} questions for fragment ${fragment.fragmentNumber}`);

      // Update fragment with summary and questions
      const updatedFragment = await prisma.studyFragment.update({
        where: { id: fragmentId },
        data: {
          summary,
          questions: {
            deleteMany: {}, // Clear existing questions
            create: questions.map(q => ({
              text: q.question,
              options: q.options || [],
              answer: q.correctAnswer || ""
            }))
          }
        },
        include: {
          questions: true
        }
      });

      console.log(`Fragment ${fragment.fragmentNumber} processed successfully with ${updatedFragment.questions.length} questions`);

      return updatedFragment;
    } catch (error) {
      console.error(`Error processing fragment ${fragmentId}:`, error);
      throw error;
    }
  }

  async processAllFragmentsForPlan(studyPlanId: string) {
    const fragments = await prisma.studyFragment.findMany({
      where: { studyPlanId },
      orderBy: { fragmentNumber: 'asc' }
    });

    console.log(`Processing ${fragments.length} fragments for study plan ${studyPlanId}`);

    const processed: any = [];

    // Process fragments in batches to avoid rate limits
    const batchSize = 3; // Reduced batch size for better reliability
    for (let i = 0; i < fragments.length; i += batchSize) {
      const batch = fragments.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(fragments.length / batchSize)}`);
      
      const batchResults = await Promise.allSettled(
        batch.map((fragment: StudyFragment) => this.processFragmentWithAI(fragment.id))
      );
      
      // Handle both successful and failed results
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          processed.push(result.value);
        } else {
          console.error(`Failed to process fragment ${batch[index]?.fragmentNumber}:`, result.reason);
        }
      });

      // Add delay between batches
      if (i + batchSize < fragments.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
      }
    }

    console.log(`Successfully processed ${processed.length}/${fragments.length} fragments`);

    return processed;
  }

  async answerQuestion(question: string, context: string[]): Promise<string> {
    const contextText = context.join('\n\n---\n\n');

    const prompt = `You are a helpful study assistant answering student questions based on their study materials.

Study Materials:
${contextText}

Student Question:
${question}

Provide a clear, accurate answer based ONLY on the provided study materials. If the materials don't contain enough information to answer the question, say so. Keep the answer concise (2-3 paragraphs max).`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
      });
      const answer = response.text || "No valid text";

      return answer;
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to generate answer');
    }
  }

  async improveStudyNotes(notes: string, content: string): Promise<string> {
    const prompt = `You are a study assistant helping improve student notes.

Original Study Content:
${content}

Student's Notes:
${notes}

Review and enhance these notes by:
1. Filling in any missing key concepts
2. Organizing information more clearly
3. Adding helpful mnemonics or memory aids if applicable
4. Highlighting connections between concepts
5. Keeping the student's voice and style

Return only the improved notes, no additional commentary.`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
      });
      const improvedNotes = response.text || "No valid text";

      return improvedNotes;
    } catch (error) {
      console.error('Error improving notes:', error);
      return notes;
    }
  }

  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

      const loadingTask = pdfjsLib.getDocument({
        data: data,
        useWorkerFetch: false,
        isEvalSupported: false,
      });

      const pdf = await loadingTask.promise;
      let text = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        text += content.items
          .map((item: any) => item.str || "")
          .join(" ") + "\n";
      }

      return text.trim();
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  async extractTextFromImage(buffer: Buffer, mimeType: string = 'image/jpeg'): Promise<string> {
    try {
      const imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: mimeType
        }
      };

      const prompt = 'Extract all text from this image. Include all visible text, maintaining the original structure and formatting as much as possible.';

      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [prompt, imagePart]
      });
      const extractedText = response.text || "No valid text";

      return extractedText;
    } catch (error) {
      console.error('Error extracting text from image:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async analyzeMaterialDifficulty(content: string): Promise<{
    level: 'beginner' | 'intermediate' | 'advanced';
    estimatedStudyTime: number;
    topicComplexity: string
  }> {
    const prompt = `Analyze this study material and provide a difficulty assessment.

Content:
${content.substring(0, 2000)}...

Return ONLY a JSON object in this format (no markdown):
{
  "level": "beginner" | "intermediate" | "advanced",
  "estimatedStudyTime": <number in hours>,
  "topicComplexity": "<brief description of complexity>"
}`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt
      });
      let text = response.text || "No valid text";

      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const analysis = JSON.parse(text);
      return analysis;
    } catch (error) {
      console.error('Error analyzing material difficulty:', error);
      return {
        level: 'intermediate',
        estimatedStudyTime: 5,
        topicComplexity: 'Unable to analyze complexity'
      };
    }
  }
}

export default new AIService();