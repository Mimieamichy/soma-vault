// services/material.service.ts
import { MaterialType } from '@prisma/client';
import prisma from '../../lib/prisma';
import aiService from '../ai/gemini.ai.service';

interface CreateMaterialInput {
  userId: string;
  title: string;
  type: MaterialType;
  fileUrl?: string;
  content: string;
  fileSize?: number;
  department: string;
}

interface UploadFileInput {
  userId: string;
  title: string;
  file: Express.Multer.File;
  department: string;
}

class MaterialService {
  async createMaterial(data: CreateMaterialInput) {
    const { userId, title, type, fileUrl, content, fileSize, department } = data;

    const material = await prisma.material.create({
      data: {
        userId,
        title,
        type,
        fileUrl: fileUrl || null,
        content,
        fileSize: fileSize || null,
        department: department,
        archived: false
      }
    });

    return material;
  }

  async uploadFile(data: UploadFileInput) {
    const { userId, title, file, department } = data;

    let content = '';
    let type: MaterialType;

    // Determine material type from file
    const mimeType = file.mimetype;
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (mimeType === 'application/pdf') {
      type = MaterialType.PDF;
      content = await aiService.extractTextFromPDF(file.buffer);
    } else if (mimeType.startsWith('image/')) {
      type = MaterialType.IMAGE;
      content = await aiService.extractTextFromImage(file.buffer, mimeType);
    } else if (extension === 'doc' || mimeType === 'application/msword') {
      type = MaterialType.DOC;
      content = file.buffer.toString('utf-8');
    } else if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      type = MaterialType.DOCX;
      // You'd use a library like mammoth to extract text from DOCX
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      content = result.value;
    } else if (mimeType === 'text/plain') {
      type = MaterialType.TXT;
      content = file.buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type');
    }

    // Create material
    const material = await this.createMaterial({
      userId,
      title: title || file.originalname,
      type,
      content,
      fileSize: file.size,
      department: department
    });

    return material;
  }

  async createTextNote(userId: string, title: string, content: string, department: string) {
    return await this.createMaterial({
      userId,
      title: title || 'Untitled Note',
      type: MaterialType.NOTE,
      content,
      fileSize: content.length,
      department: department
    });
  }

  async getMaterial(materialId: string, userId: string) {
    const material = await prisma.material.findFirst({
      where: {
        id: materialId,
        userId
      }
    });

    if (!material) {
      throw new Error('Material not found');
    }

    // Update last accessed time
    await prisma.material.update({
      where: { id: materialId },
      data: { lastAccessedAt: new Date() }
    });

    return material;
  }

  async getUserMaterials(userId: string, archived?: boolean, tags?: string[]) {
    const where: any = { userId };

    if (typeof archived === 'boolean') {
      where.archived = archived;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }

    const materials = await prisma.material.findMany({
      where,
      orderBy: {
        uploadedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        type: true,
        fileUrl: true,
        fileSize: true,
        archived: true,
        tags: true,
        uploadedAt: true,
        lastAccessedAt: true,
        _count: {
          select: {
            studyPlans: true,
            qaHistory: true
          }
        }
      }
    });

    return materials;
  }

  async updateMaterial(materialId: string, userId: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
    archived?: boolean;
  }) {
    const material = await prisma.material.findFirst({
      where: {
        id: materialId,
        userId
      }
    });

    if (!material) {
      throw new Error('Material not found');
    }

    return await prisma.material.update({
      where: { id: materialId },
      data
    });
  }

  async archiveMaterial(materialId: string, userId: string) {
    return await this.updateMaterial(materialId, userId, { archived: true });
  }

  async unarchiveMaterial(materialId: string, userId: string) {
    return await this.updateMaterial(materialId, userId, { archived: false });
  }

  async deleteMaterial(materialId: string, userId: string) {
    const material = await prisma.material.findFirst({
      where: {
        id: materialId,
        userId
      },
      include: {
        studyPlans: true
      }
    });

    if (!material) {
      throw new Error('Material not found');
    }

    // Check if material is being used in any active study plans
    const activeStudyPlans = material.studyPlans.filter(
      plan => plan.status === 'ACTIVE' || plan.status === 'PAUSED'
    );

    if (activeStudyPlans.length > 0) {
      throw new Error('Cannot delete material with active study plans. Archive it instead.');
    }

    await prisma.material.delete({
      where: { id: materialId }
    });

    return { message: 'Material deleted successfully' };
  }

  async searchMaterials(userId: string, query: string) {
    const materials = await prisma.material.findMany({
      where: {
        userId,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            department: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        lastAccessedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        type: true,
        department: true,
        uploadedAt: true,
        archived: true
      }
    });

    return materials;
  }

  async getMaterialStats(userId: string) {
    const [total, archived, byType] = await Promise.all([
      prisma.material.count({
        where: { userId }
      }),
      prisma.material.count({
        where: { userId, archived: true }
      }),
      prisma.material.groupBy({
        by: ['type'],
        where: { userId },
        _count: true
      })
    ]);

    return {
      total,
      active: total - archived,
      archived,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>)
    };
  }

}

export default new MaterialService();