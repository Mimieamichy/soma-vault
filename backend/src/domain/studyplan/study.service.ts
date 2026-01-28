// services/studyplan.service.ts
import { StudyFrequency, PlanStatus } from '@prisma/client';
import materialService from '../materials/materials.service';
import geminiAiService from '../ai/gemini.ai.service';
import { AppError } from "../../shared/middlewares/error.middleware";

import prisma from '../../lib/prisma';

interface CreateStudyPlanInput {
  userId: string;
  materialId: string;
  title: string;
  totalDays: number;
  studyFrequency: StudyFrequency;
  startDate: Date;
  department?: string
  file?: Express.Multer.File;
}

interface StudyFragmentData {
  fragmentNumber: number;
  content: string;
  summary: string;
  questions: any[];
  scheduledDate: Date;
}

type StudyProgressItem = {
  fragmentId: string;
  completed: boolean;
  completedAt: Date | null;
  timeSpent: number | null;
};

type StudyFragmentItem = {
  id: string;
} & Record<string, unknown>;

class StudyPlanService {
  async createStudyPlan(data: CreateStudyPlanInput) {
    const { userId, materialId, title, totalDays, studyFrequency, startDate } = data;

    // Verify material exists and belongs to user
    const material = await prisma.material.findFirst({
      where: {
        id: materialId,
        userId
      }
    });

    if (!material) {
      throw new AppError('Material not found', 404);
    }

    // Calculate end date based on frequency
    const endDate = this.calculateEndDate(startDate, totalDays, studyFrequency);

    // Create study plan
    const studyPlan = await prisma.studyPlan.create({
      data: {
        userId,
        materialId,
        title,
        totalDays,
        studyFrequency,
        startDate,
        endDate,
        status: PlanStatus.ACTIVE
      }
    });

    // Break material into fragments
    const fragments = await this.generateFragments(
      material.content,
      totalDays,
      studyFrequency,
      startDate,
      studyPlan.id
    );

    let processedFragments = [];
      try {
        processedFragments = await geminiAiService.processAllFragmentsForPlan(studyPlan.id);
      } catch (error) {
        console.error('AI processing error:', error);
      }

      const completeStudyPlan = await this.getStudyPlan(studyPlan.id, userId);

    return {
      completeStudyPlan,
      fragments,
      aiProcessed: processedFragments.length > 0
    };
  }


    async createStudyPlanWithFileUpload(data: {
      userId: string;
      title: string;
      totalDays: number;
      studyFrequency: StudyFrequency;
      startDate: Date;
      file: Express.Multer.File;
      department: string;
    }) {
      const { userId, title, totalDays, studyFrequency, startDate, file, department } = data;
      if (!file) {
        throw new AppError('File is required for this operation', 400);
      }
    // Upload and process the file
    const uploadedMaterial = await materialService.uploadFile({
      userId,
      title: file.originalname,
      file,
      department
    });

    // Create study plan using the uploaded material
    return await this.createStudyPlan({
      userId,
      materialId: uploadedMaterial.id,
      title,
      totalDays,
      studyFrequency,
      startDate
    });
  }



  async generateFragments(content: string,totalDays: number, frequency: StudyFrequency, startDate: Date, studyPlanId: string): Promise<StudyFragmentData[]> {
    // Calculate number of study sessions
    const sessions = this.calculateSessions(totalDays, frequency);

    // Split content into fragments
    const contentFragments = this.splitContent(content, sessions);

    const fragments: StudyFragmentData[] = [];

    for (let i = 0; i < contentFragments.length; i++) {
      const scheduledDate = this.calculateScheduledDate(startDate, i, frequency);

      const fragmentContent = contentFragments[i];
      if (fragmentContent) {
        fragments.push({
          fragmentNumber: i + 1,
          content: fragmentContent,
          summary: '', 
          questions: [],
          scheduledDate
        });
      }
    }

    // Create fragments in database
    await prisma.studyFragment.createMany({
      data: fragments.map(f => ({
        studyPlanId,
        fragmentNumber: f.fragmentNumber,
        content: f.content,
        summary: f.summary,
        scheduledDate: f.scheduledDate
      }))
    });

    return fragments;
  }

  splitContent(content: string, parts: number): string[] {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const wordsPerPart = Math.ceil(words.length / parts);
    const fragments: string[] = [];

    for (let i = 0; i < parts; i++) {
      const start = i * wordsPerPart;
      const end = start + wordsPerPart;
      const fragment = words.slice(start, end).join(' ');
      fragments.push(fragment);
    }

    return fragments.filter(f => f.length > 0);
  }

  calculateSessions(totalDays: number, frequency: StudyFrequency): number {
    switch (frequency) {
      case StudyFrequency.DAILY:
        return totalDays;
      case StudyFrequency.TWICE_WEEKLY:
        return Math.ceil((totalDays / 7) * 2);
      case StudyFrequency.WEEKLY:
        return Math.ceil(totalDays / 7);
      case StudyFrequency.BIWEEKLY:
        return Math.ceil(totalDays / 14);
      default:
        return totalDays;
    }
  }

  calculateEndDate(startDate: Date, totalDays: number, frequency: StudyFrequency): Date {
    const end = new Date(startDate);
    end.setDate(end.getDate() + totalDays);
    return end;
  }

  calculateScheduledDate(startDate: Date, sessionIndex: number, frequency: StudyFrequency): Date {
    const date = new Date(startDate);

    switch (frequency) {
      case StudyFrequency.DAILY:
        date.setDate(date.getDate() + sessionIndex);
        break;
      case StudyFrequency.TWICE_WEEKLY:
        date.setDate(date.getDate() + (Math.floor(sessionIndex / 2) * 7) + ((sessionIndex % 2) * 3));
        break;
      case StudyFrequency.WEEKLY:
        date.setDate(date.getDate() + (sessionIndex * 7));
        break;
      case StudyFrequency.BIWEEKLY:
        date.setDate(date.getDate() + (sessionIndex * 14));
        break;
    }

    return date;
  }

  async getStudyPlan(studyPlanId: string, userId: string) {
    const studyPlan = await prisma.studyPlan.findFirst({
      where: {
        id: studyPlanId,
        userId
      },
      include: {
        material: {
          select: {
            id: true,
            title: true,
            type: true
          }
        },
        fragments: {
          orderBy: {
            fragmentNumber: 'asc'
          }
        },
        progress: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!studyPlan) {
      throw new AppError('Study plan not found', 404);
    }

    return studyPlan;
  }

  async getUserStudyPlans(userId: string, status?: PlanStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const studyPlans = await prisma.studyPlan.findMany({
      where,
      include: {
        material: {
          select: {
            id: true,
            title: true,
            type: true
          }
        },
        _count: {
          select: {
            fragments: true,
            progress: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return studyPlans;
  }

  async updateStudyPlanStatus(studyPlanId: string, userId: string, status: PlanStatus) {
    const studyPlan = await prisma.studyPlan.findFirst({
      where: {
        id: studyPlanId,
        userId
      }
    });

    if (!studyPlan) {
      throw new AppError('Study plan not found', 404);
    }

    return await prisma.studyPlan.update({
      where: { id: studyPlanId },
      data: { status }
    });
  }

  async markFragmentComplete(
    fragmentId: string,
    userId: string,
    timeSpent?: number,
    notes?: string
  ) {
    const fragment = await prisma.studyFragment.findUnique({
      where: { id: fragmentId },
      include: {
        studyPlan: true
      }
    });

    if (!fragment || fragment.studyPlan.userId !== userId) {
      throw new AppError('Fragment not found', 404);
    }

    const progress = await prisma.studyProgress.upsert({
      where: {
        userId_fragmentId: {
          userId,
          fragmentId
        }
      },
      create: {
        userId,
        studyPlanId: fragment.studyPlanId,
        fragmentId,
        completed: true,
        completedAt: new Date(),
        timeSpent: timeSpent ?? null,
        notes: notes ?? null
      },
      update: {
        completed: true,
        completedAt: new Date(),
        timeSpent: timeSpent ?? null,
        notes: notes ?? null
      }
    });

    // Check if all fragments are completed
    await this.checkAndCompleteStudyPlan(fragment.studyPlanId, userId);

    return progress;
  }

  async checkAndCompleteStudyPlan(studyPlanId: string, userId: string) {
    const studyPlan = await prisma.studyPlan.findUnique({
      where: { id: studyPlanId },
      include: {
        fragments: true,
        progress: {
          where: {
            userId,
            completed: true
          }
        }
      }
    });

    if (!studyPlan) return;

    // If all fragments are completed, mark study plan as completed
    if (studyPlan.fragments.length === studyPlan.progress.length) {
      await prisma.studyPlan.update({
        where: { id: studyPlanId },
        data: { status: PlanStatus.COMPLETED }
      });
    }
  }

  async getStudyProgress(studyPlanId: string, userId: string) {
    const studyPlan = await prisma.studyPlan.findFirst({
      where: {
        id: studyPlanId,
        userId
      },
      include: {
        fragments: {
          orderBy: {
            fragmentNumber: 'asc'
          }
        },
        progress: {
          where: { userId }
        }
      }
    });

    if (!studyPlan) {
      throw new AppError('Study plan not found', 404);
    }

    const totalFragments = studyPlan.fragments.length;
    const completedFragments = studyPlan.progress.filter((p: StudyProgressItem) => p.completed).length;
    const progressPercentage = (completedFragments / totalFragments) * 100;

    return {
      studyPlan: {
        id: studyPlan.id,
        title: studyPlan.title,
        status: studyPlan.status
      },
      totalFragments,
      completedFragments,
      progressPercentage: Math.round(progressPercentage),
      fragments: studyPlan.fragments.map((f: StudyFragmentItem) => {
        const progress = studyPlan.progress.find((p: StudyProgressItem) => p.fragmentId === f.id);
        return {
          ...f,
          completed: progress?.completed || false,
          completedAt: progress?.completedAt,
          timeSpent: progress?.timeSpent
        };
      })
    };
  }

  async deleteStudyPlan(studyPlanId: string, userId: string) {
    const studyPlan = await prisma.studyPlan.findFirst({
      where: {
        id: studyPlanId,
        userId
      }
    });

    if (!studyPlan) {
      throw new AppError('Study plan not found', 404);
    }

    await prisma.studyPlan.delete({
      where: { id: studyPlanId }
    });

    return { message: 'Study plan deleted successfully' };
  }
}

export default new StudyPlanService();
