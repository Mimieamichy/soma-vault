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
  group?: string
  file?: Express.Multer.File;
  level?: '100' | '200' | '300' | '400' | '500';
  materialType?: 'PQ' | 'NOTES';
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

type StudyPlanResponse = {
  studyPlan: {
    id: string;
    title: string;
    totalDays: number;
    studyFrequency: StudyFrequency;
    startDate: Date;
    endDate: Date;
    status: PlanStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  material: {
    id: string;
    title: string;
    type: string;
    group: string;
    level: string;
    materialType: string;
  } | null;
  fragments: {
    id: string;
    fragmentNumber: number;
    summary: string;
    content: string;
    scheduledDate: Date;
    questions: {
      id: string;
      text: string;
      options: any;
      answer: string;
    }[];
  }[];
  stats: {
    totalFragments: number;
    aiProcessed?: boolean;
  };
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

    console.log(`Study plan created: ${studyPlan.id}`);

    // Break material into fragments
    const fragments = await this.generateFragments(
      material.content,
      totalDays,
      studyFrequency,
      startDate,
      studyPlan.id
    );

    console.log(`Generated ${fragments.length} fragments`);

    // Process fragments with AI
    let aiProcessed = false;
    
    try {
      console.log('Starting AI processing...');
      const processedFragments = await geminiAiService.processAllFragmentsForPlan(studyPlan.id);
      aiProcessed = processedFragments.length > 0;
      console.log(`AI processing complete: ${processedFragments.length} fragments processed`);
    } catch (error) {
      console.error('AI processing error:', error);
      // Continue without AI processing rather than failing
    }

    // Fetch the complete study plan with all relationships
    const completeStudyPlan = await this.getStudyPlan(studyPlan.id, userId);

    return {
      completeStudyPlan,
      fragments: completeStudyPlan.fragments, // Use fragments from DB with summaries/questions
      aiProcessed
    };
  }

  async createStudyPlanWithFileUpload(data: {userId: string; title: string; totalDays: number; studyFrequency: StudyFrequency; startDate: Date; file: Express.Multer.File; group: string; level: '100' | '200' | '300' | '400' | '500'; materialType: 'NOTES' | 'PQ'}) : Promise<StudyPlanResponse>{
    const { userId, title, totalDays, studyFrequency, startDate, file, group, level, materialType } = data;
    
    if (!file) {
      throw new AppError('File is required for this operation', 400);
    }

    console.log(`Processing file upload: ${file.originalname}`);

    // Upload and process the file
    const uploadedMaterial = await materialService.uploadFile({
      userId,
      title: file.originalname,
      file,
      group,
      level,
      materialType
    });


    // Create study plan using the uploaded material
    const studyPlanResult = await this.createStudyPlan({
      userId,
      materialId: uploadedMaterial.id,
      title,
      totalDays,
      studyFrequency,
      startDate
    });

    // Return only the essential data
    return {
      studyPlan: {
        id: studyPlanResult.completeStudyPlan.studyPlan.id,
        title: studyPlanResult.completeStudyPlan.studyPlan.title,
        totalDays: studyPlanResult.completeStudyPlan.studyPlan.totalDays,
        studyFrequency: studyPlanResult.completeStudyPlan.studyPlan.studyFrequency,
        startDate: studyPlanResult.completeStudyPlan.studyPlan.startDate,
        endDate: studyPlanResult.completeStudyPlan.studyPlan.endDate,
        status: studyPlanResult.completeStudyPlan.studyPlan.status,
        createdAt: studyPlanResult.completeStudyPlan.studyPlan.createdAt,
        updatedAt: studyPlanResult.completeStudyPlan.studyPlan.updatedAt
      },
      material: {
        id: uploadedMaterial.id,
        title: uploadedMaterial.title,
        type: uploadedMaterial.type,
        group: uploadedMaterial.group,
        level: uploadedMaterial.level,
        materialType: uploadedMaterial.materialType
      },
      fragments: studyPlanResult.fragments.map(fragment => ({
        id: fragment.id,
        fragmentNumber: fragment.fragmentNumber,
        summary: fragment.summary,
        content: fragment.content,
        scheduledDate: fragment.scheduledDate,
        questions: fragment.questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options,
          answer: q.answer
        }))
      })),
      stats: {
        totalFragments: studyPlanResult.fragments.length,
        aiProcessed: studyPlanResult.aiProcessed
      }
    };
  }

  async generateFragments(
    content: string,
    totalDays: number,
    frequency: StudyFrequency,
    startDate: Date,
    studyPlanId: string
  ): Promise<StudyFragmentData[]> {
    // Calculate number of study sessions
    const sessions = this.calculateSessions(totalDays, frequency);

    console.log(`Generating ${sessions} fragments for ${totalDays} days with ${frequency} frequency`);

    // Split content into fragments
    const contentFragments = this.splitContent(content, sessions);

    const fragments: StudyFragmentData[] = [];

    for (let i = 0; i < contentFragments.length; i++) {
      const scheduledDate = this.calculateScheduledDate(startDate, i, frequency);

      const fragmentContent = contentFragments[i];
      if (fragmentContent && fragmentContent.trim().length > 0) {
        fragments.push({
          fragmentNumber: i + 1,
          content: fragmentContent.trim(),
          summary: '', // Will be generated by AI
          questions: [], // Will be generated by AI
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

    console.log(`Created ${fragments.length} fragments in database`);

    return fragments;
  }

  
  async getStudyPlan(studyPlanId: string, userId: string): Promise<StudyPlanResponse>{
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
            type: true,
            group: true,
            level: true,
            materialType: true
          }
        },
        fragments: {
          orderBy: {
            fragmentNumber: 'asc'
          },
          include: {
            questions: true
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

    return {
      studyPlan: {
        id: studyPlan.id,
        title: studyPlan.title,
        totalDays: studyPlan.totalDays,
        studyFrequency: studyPlan.studyFrequency,
        startDate: studyPlan.startDate,
        endDate: studyPlan.endDate,
        status: studyPlan.status,
        createdAt: studyPlan.createdAt,
        updatedAt: studyPlan.updatedAt
      },
      material: studyPlan.material
        ? {
            id: studyPlan.material.id,
            title: studyPlan.material.title,
            type: studyPlan.material.type,
            group: studyPlan.material.group,
            level: studyPlan.material.level,
            materialType: studyPlan.material.materialType
          }
        : null,
      fragments: studyPlan.fragments.map(fragment => ({
        id: fragment.id,
        fragmentNumber: fragment.fragmentNumber,
        summary: fragment.summary,
        content: fragment.content,
        scheduledDate: fragment.scheduledDate,
        questions: fragment.questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options,
          answer: q.answer
        }))
      })),
      stats: {
        totalFragments: studyPlan.fragments.length,
      }
    };
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

  async markFragmentComplete(fragmentId: string, userId: string) {
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
      },
      update: {
        completed: true,
        completedAt: new Date(),
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

  splitContent(content: string, parts: number): string[] {
    // Remove excessive whitespace and normalize
    const normalized = content.replace(/\s+/g, ' ').trim();
    
    const words = normalized.split(/\s+/).filter(word => word.length > 0);
    const wordsPerPart = Math.ceil(words.length / parts);
    const fragments: string[] = [];

    for (let i = 0; i < parts; i++) {
      const start = i * wordsPerPart;
      const end = start + wordsPerPart;
      const fragment = words.slice(start, end).join(' ');
      
      if (fragment.trim().length > 0) {
        fragments.push(fragment.trim());
      }
    }

    return fragments;
  }

  calculateSessions(totalDays: number, frequency: StudyFrequency): number {
    switch (frequency) {
      case StudyFrequency.DAILY:
        return totalDays;
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
      case StudyFrequency.WEEKLY:
        date.setDate(date.getDate() + (sessionIndex * 7));
        break;
      case StudyFrequency.BIWEEKLY:
        date.setDate(date.getDate() + (sessionIndex * 14));
        break;
    }

    return date;
  }
}

export default new StudyPlanService();