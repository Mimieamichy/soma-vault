// services/ai.service.ts
import { StudyFragment } from '@prisma/client';
import { GoogleGenAI } from "@google/genai";
import prisma from "../../lib/prisma";

// const prisma = new PrismaClient(); // Removed: Use singleton instance


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
      const summary = response.text || "No valid text";

      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  async generateQuestions(content: string, count: number = 5): Promise<Question[]> {
    const prompt = `You are a study assistant creating practice questions.

    Study Content:
    ${content}

    Generate ${count} diverse practice questions based on this content:
    - Mix of 2 multiple choice questions (with 4 options each)
    - 2 true/false questions
    - 1 short answer question

    Return ONLY a valid JSON array in this exact format (no markdown, no explanation):
    [
      {
        "question": "Question text here?",
        "type": "multiple_choice",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A"
      },
      {
        "question": "Statement here?",
        "type": "true_false",
        "options": ["True", "False"],
        "correctAnswer": "True"
      },
      {
        "question": "Explain...",
        "type": "short_answer"
      }
    ]

    Ensure questions test understanding, not just memorization.`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
      });
      let textContent = response.text || "No valid text";

      // Clean up response and parse JSON
      textContent = textContent.trim();
      
      // Remove markdown code blocks if present
      textContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const questions = JSON.parse(textContent) as Question[];

      // Validate structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid questions format');
      }

      return questions.slice(0, count);
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback to generic questions if AI fails
      return this.generateFallbackQuestions(count);
    }
  }

  private generateFallbackQuestions(count: number): Question[] {
    const questions: Question[] = [
      {
        question: 'What is the main concept discussed in this section?',
        type: 'short_answer'
      },
      {
        question: 'The information presented in this section is important for understanding the overall topic.',
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'True'
      }
    ];

    return questions.slice(0, count);
  }

  async processFragmentWithAI(fragmentId: string) {
    const fragment = await prisma.studyFragment.findUnique({
      where: { id: fragmentId },
      include: {
        studyPlan: {
          include: {
            fragments: {
              select: { id: true } // we only need the count
            }
          }
        }
      }
    });

    if (!fragment) {
      throw new Error('Fragment not found');
    }

    // Generate summary & questions in parallel
    const [summary, questions] = await Promise.all([
      this.generateFragmentSummary({
        content: fragment.content,
        fragmentNumber: fragment.fragmentNumber,
        totalFragments: fragment.studyPlan.fragments.length
      }),
      this.generateQuestions(fragment.content, 5)
    ]);

    // Update fragment + relational questions
    return await prisma.studyFragment.update({
      where: { id: fragmentId },
      data: {
        summary,
        questions: {
          deleteMany: {}, // idempotent re-runs
          create: questions.map(q => ({
            text: q.question,
            options: q.options ?? [],
            answer: q.correctAnswer ?? ""
          }))
        }
      },
      include: {
        questions: true
      }
    });
  }



  async processAllFragmentsForPlan(studyPlanId: string) {
    const fragments = await prisma.studyFragment.findMany({
      where: { studyPlanId },
      orderBy: { fragmentNumber: 'asc' }
    });

    const processed = [];

    // Process fragments in batches to avoid rate limits
    const batchSize = 5; // Gemini has higher rate limits
    for (let i = 0; i < fragments.length; i += batchSize) {
      const batch = fragments.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map((fragment: StudyFragment) => this.processFragmentWithAI(fragment.id))
      );
      
      processed.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < fragments.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

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
      return notes; // Return original if enhancement fails
    }
  }

  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    // For PDF text extraction, you'd use a library like pdf-parse
    const pdfParse = require('pdf-parse');
    
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
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
        model: "gemini-2.5-flash",
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
    estimatedStudyTime: number; // in hours
    topicComplexity: string;
  }> {
    const prompt = `Analyze this study material and provide a difficulty assessment.

    Content:
    ${content.substring(0, 2000)}... // First 2000 chars

    Return ONLY a JSON object in this format (no markdown):
    {
      "level": "beginner" | "intermediate" | "advanced",
      "estimatedStudyTime": <number in hours>,
      "topicComplexity": "<brief description of complexity>"
    }`;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      let text = response.text || "No valid text";

      // Clean up response
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const analysis = JSON.parse(text);
      return analysis;
    } catch (error) {
      console.error('Error analyzing material difficulty:', error);
      // Return default values on error
      return {
        level: 'intermediate',
        estimatedStudyTime: 5,
        topicComplexity: 'Unable to analyze complexity'
      };
    }
  }
}

export default new AIService();