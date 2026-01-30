// services/pqhub.service.ts
import prisma from '../../lib/prisma';
import aiService from '../ai/gemini.ai.service';

interface AskQuestionInput {
  userId: string;
  question: string;
  materialIds?: string[];
}

class PQHubService {
  async askQuestion(data: AskQuestionInput) {
    const { userId, question, materialIds } = data;

    // Get user's materials (either specific ones or all)
    const materials = await prisma.material.findMany({
      where: {
        userId,
        archived: false,
        ...(materialIds && materialIds.length > 0 
          ? { id: { in: materialIds } } 
          : {})
      },
      select: {
        id: true,
        title: true,
        content: true
      }
    });

    if (materials.length === 0) {
      throw new Error('No materials found. Please upload study materials first.');
    }

    // Extract content from materials
    const context = materials.map(m => m.content);

    // Get AI answer
    const answer = await aiService.answerQuestion(question, context);

    // Save to history
    const qaHistory = await prisma.qAHistory.create({
      data: {
        userId,
        question,
        answer,
        tokensUsed: this.estimateTokens(question + answer)
      }
    });

    // Link materials used
    if (materials.length > 0) {
      await prisma.qAHistoryMaterial.createMany({
        data: materials.map(m => ({
          qaHistoryId: qaHistory.id,
          materialId: m.id
        }))
      });
    }

    return {
      id: qaHistory.id,
      question: qaHistory.question,
      answer: qaHistory.answer,
      materialsUsed: materials.map(m => ({
        id: m.id,
        title: m.title
      })),
      createdAt: qaHistory.createdAt
    };
  }

  async getHistory(userId: string, limit: number = 50, offset: number = 0) {
    const history = await prisma.qAHistory.findMany({
      where: { userId },
      include: {
        materials: {
          include: {
            material: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    return history.map(h => ({
      id: h.id,
      question: h.question,
      answer: h.answer,
      materialsUsed: h.materials.map(m => m.material),
      createdAt: h.createdAt
    }));
  }

  async getQuestionById(questionId: string, userId: string) {
    const qa = await prisma.qAHistory.findFirst({
      where: {
        id: questionId,
        userId
      },
      include: {
        materials: {
          include: {
            material: {
              select: {
                id: true,
                title: true,
                type: true
              }
            }
          }
        }
      }
    });

    if (!qa) {
      throw new Error('Question not found');
    }

    return {
      id: qa.id,
      question: qa.question,
      answer: qa.answer,
      materialsUsed: qa.materials.map(m => m.material),
      createdAt: qa.createdAt
    };
  }

  async deleteQuestion(questionId: string, userId: string) {
    const qa = await prisma.qAHistory.findFirst({
      where: {
        id: questionId,
        userId
      }
    });

    if (!qa) {
      throw new Error('Question not found');
    }

    await prisma.qAHistory.delete({
      where: { id: questionId }
    });

    return { message: 'Question deleted successfully' };
  }

  async clearHistory(userId: string) {
    await prisma.qAHistory.deleteMany({
      where: { userId }
    });

    return { message: 'History cleared successfully' };
  }

  async searchHistory(userId: string, query: string) {
    const history = await prisma.qAHistory.findMany({
      where: {
        userId,
        OR: [
          {
            question: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            answer: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        materials: {
          include: {
            material: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return history.map(h => ({
      id: h.id,
      question: h.question,
      answer: h.answer,
      materialsUsed: h.materials.map(m => m.material),
      createdAt: h.createdAt
    }));
  }

  async getStats(userId: string) {
    const [totalQuestions, totalMaterials] = await Promise.all([
      prisma.qAHistory.count({
        where: { userId }
      }),
      prisma.material.count({
        where: { 
          userId,
          archived: false
        }
      })
    ]);

    return {
      totalQuestions,
      totalMaterials
    };
  }

  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

export default new PQHubService();