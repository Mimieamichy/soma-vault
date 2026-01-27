// services/material.ingest.ts
import mammoth from 'mammoth';
import { MaterialType } from '@prisma/client';
import aiService from '../ai/gemini.ai.service';

interface FileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  extension?: string;
}

interface IngestedContent {
  content: string;
  type: MaterialType;
  metadata: {
    wordCount: number;
    pageCount?: number;
    hasImages?: boolean;
    language?: string;
    readingTime?: number; // in minutes
  };
}

class MaterialIngestService {
  /**
   * Main ingestion method - routes to appropriate handler based on file type
   */
  async ingestFile(buffer: Buffer, metadata: FileMetadata): Promise<IngestedContent> {
    const { mimeType, extension, originalName } = metadata;

    try {
      let content = '';
      let type: MaterialType;
      let additionalMetadata: any = {};

      if (mimeType === 'application/pdf') {
        const result = await this.ingestPDF(buffer);
        content = result.content;
        type = MaterialType.PDF;
        additionalMetadata = result.metadata;
      } else if (mimeType.startsWith('image/')) {
        content = await this.ingestImage(buffer, mimeType);
        type = MaterialType.IMAGE;
      } else if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await this.ingestDOCX(buffer);
        type = MaterialType.DOCX;
      } else if (extension === 'doc' || mimeType === 'application/msword') {
        content = await this.ingestDOC(buffer);
        type = MaterialType.DOC;
      } else if (mimeType === 'text/plain') {
        content = await this.ingestText(buffer);
        type = MaterialType.TXT;
      } else {
        throw new Error(`Unsupported file type: ${mimeType}`);
      }

      // Clean and validate content
      content = this.cleanContent(content);

      if (!content || content.length < 10) {
        throw new Error('No readable content found in file');
      }

      // Calculate metadata
      const wordCount = this.countWords(content);
      const readingTime = this.estimateReadingTime(wordCount);

      return {
        content,
        type,
        metadata: {
          wordCount,
          readingTime,
          ...additionalMetadata
        }
      };
    } catch (error) {
      console.error('Ingestion error:', error);
      throw new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract text from PDF files
   */
  async ingestPDF(buffer: Buffer): Promise<{ content: string; metadata: any }> {
    try {
    const pdfParse = await import('pdf-parse');
    const parseFunc = (pdfParse as any).default || pdfParse;
    
      const data = await parseFunc(buffer);

      return {
        content: data.text,
        metadata: {
          pageCount: data.numpages,
          hasImages: data.numrender > 0
        }
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Extract text from images using AI
   */
  async ingestImage(buffer: Buffer, mimeType: string): Promise<string> {
    try {
      const content = await aiService.extractTextFromImage(buffer, mimeType);

      if (!content || content.trim().length === 0) {
        throw new Error('No text found in image');
      }

      return content;
    } catch (error) {
      console.error('Image text extraction error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract text from DOCX files
   */
  async ingestDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });

      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No text found in DOCX file');
      }

      return result.value;
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to extract text from DOCX');
    }
  }

  /**
   * Extract text from DOC files (older format)
   */
  async ingestDOC(buffer: Buffer): Promise<string> {
    try {
      // For older DOC files, try using mammoth first
      const result = await mammoth.extractRawText({ buffer });

      if (result.value && result.value.trim().length > 0) {
        return result.value;
      }

      // Fallback: try reading as plain text (may have formatting issues)
      const text = buffer.toString('utf-8');
      
      // Remove common DOC binary artifacts
      const cleaned = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

      if (cleaned.trim().length === 0) {
        throw new Error('No readable text found in DOC file');
      }

      return cleaned;
    } catch (error) {
      console.error('DOC parsing error:', error);
      throw new Error('Failed to extract text from DOC file');
    }
  }

  /**
   * Extract text from plain text files
   */
  async ingestText(buffer: Buffer): Promise<string> {
    try {
      const content = buffer.toString('utf-8');

      if (!content || content.trim().length === 0) {
        throw new Error('Text file is empty');
      }

      return content;
    } catch (error) {
      console.error('Text file parsing error:', error);
      throw new Error('Failed to read text file');
    }
  }

  /**
   * Clean extracted content
   */
  private cleanContent(content: string): string {
    // Remove excessive whitespace
    let cleaned = content.replace(/\s+/g, ' ');

    // Remove control characters
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    // Normalize line breaks
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Remove multiple consecutive line breaks
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // Trim
    cleaned = cleaned.trim();

    return cleaned;
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    const words = content.match(/\b\w+\b/g);
    return words ? words.length : 0;
  }

  /**
   * Estimate reading time in minutes (average 200 words per minute)
   */
  private estimateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / 200);
  }

  /**
   * Validate file before ingestion
   */
  validateFile(metadata: FileMetadata): { valid: boolean; error?: string } {
    const { size, mimeType, extension } = metadata;

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(mimeType)) {
      return {
        valid: false,
        error: 'Unsupported file type'
      };
    }

    return { valid: true };
  }

  /**
   * Extract metadata without full ingestion (lightweight preview)
   */
  async extractMetadata(buffer: Buffer, metadata: FileMetadata): Promise<any> {
    const { mimeType } = metadata;

    const pdfParse = await import('pdf-parse');
    const parseFunc = (pdfParse as any).default || pdfParse;


    try {
      if (mimeType === 'application/pdf') {
        const data = await parseFunc(buffer);
        return {
          pageCount: data.numpages,
          hasText: data.text.length > 0
        };
      }

      return {
        size: metadata.size,
        type: mimeType
      };
    } catch (error) {
      return {
        error: 'Could not extract metadata'
      };
    }
  }

  /**
   * Chunk large content for processing
   */
  chunkContent(content: string, chunkSize: number = 5000): string[] {
    const words = content.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      chunks.push(chunk);
    }

    return chunks;
  }

  /**
   * Detect language of content (basic implementation)
   */
  detectLanguage(content: string): string {
    // This is a simple heuristic - you could use a library like franc for better detection
    const sample = content.substring(0, 500).toLowerCase();

    // Common English words
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a'];
    const englishCount = englishWords.filter(word => 
      sample.includes(` ${word} `)
    ).length;

    return englishCount >= 3 ? 'en' : 'unknown';
  }

  /**
   * Extract key terms from content (simple implementation)
   */
  extractKeyTerms(content: string, limit: number = 10): string[] {
    // Remove common stop words
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this'];

    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];

    const wordFreq: Record<string, number> = {};

    words.forEach(word => {
      if (!stopWords.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Sort by frequency and return top terms
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }
}

export default new MaterialIngestService();