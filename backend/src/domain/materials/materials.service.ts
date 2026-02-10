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
  group: string;
  level: string;
  school: string;
  materialType: string;
}

interface UploadFileInput {
  userId: string;
  title: string;
  file: Express.Multer.File;
  group: string;
  level: '100' | '200' | '300' | '400' | '500';
  materialType: 'PQ' | 'NOTES';
}

interface GetAllMaterialsInput {
  page?: number;
  limit?: number;
  group?: string;
  level?: string;
  archived?: boolean;
  sortBy?: 'uploadedAt' | 'title' | 'lastAccessedAt';
  sortOrder?: 'asc' | 'desc';
}

class MaterialService {
  async createMaterial(data: CreateMaterialInput) {
    const { userId, title, type, fileUrl, content, fileSize, group, level, materialType } = data;

    const school = await prisma.user.findUnique({
      where: { id: userId },
      select: { school: true }
    });

    const material = await prisma.material.create({
      data: {
        userId,
        title,
        type,
        fileUrl: fileUrl || null,
        content,
        fileSize: fileSize || null,
        group: group,
        archived: false,
        level: level,
        school: school?.school || '',
        materialType
      }
    });

    return material;
  }

  async uploadFile(data: UploadFileInput) {
    const { userId, title, file, group, level, materialType } = data;

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

    const school = await prisma.user.findUnique({
      where: { id: userId },
      select: { school: true }
    });
    // Create material
    const material = await this.createMaterial({
      userId,
      title: title || file.originalname,
      type,
      content,
      fileSize: file.size,
      group: group,
      level: level,
      school: school?.school || '',
      materialType: materialType,
    });

    return material;
  }

  async createTextNote(userId: string, title: string, content: string, group: string, level: string, materialType: string) {
    return await this.createMaterial({
      userId,
      title: title || 'Untitled Note',
      type: MaterialType.NOTE,
      content,
      fileSize: content.length,
      group: group,
      level: level,
      school: (await prisma.user.findUnique({
        where: { id: userId },
        select: { school: true }
      }))?.school || '',
      materialType
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

  async getUserMaterials(userId: string, group: string, archived?: boolean) {
    const where: any = { userId };

    if (typeof archived === 'boolean') {
      where.archived = archived;
    }

    if (group && group.length > 0) {
      where.group = {
        hasSome: group
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

  async getAllMaterials(filters: GetAllMaterialsInput) {
    const { page = 1, limit = 20, group, level, archived, sortBy = 'uploadedAt', sortOrder = 'desc' } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (group) {
      where.group = group;
    }

    if (level) {
      where.level = level;
    }

    if (typeof archived === 'boolean') {
      where.archived = archived;
    }

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              school: true
            }
          },
          _count: {
            select: {
              studyPlans: true,
              qaHistory: true
            }
          }
        }
      }),
      prisma.material.count({ where })
    ]);

    return {
      materials,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + materials.length < total
      }
    };
  }

  async getMaterialsBygroupName(groupName: string) {
    const [materials, totalCount] = await prisma.$transaction([
      prisma.material.findMany({
        where: { group: groupName },
        orderBy: { uploadedAt: 'desc' }
      }),
      prisma.material.count({
        where: { group: groupName }
      })
    ]);

    return {
      group: groupName,
      count: totalCount,
      materials: materials
    };
  }

  async getMaterialsBySchoolName(schoolName: string) {
    const [materials, totalCount] = await prisma.$transaction([
      prisma.material.findMany({
        where: { school: schoolName },
        orderBy: { uploadedAt: 'desc' }
      }),
      prisma.material.count({
        where: { school: schoolName }
      })
    ]);

    return {
      school: schoolName,
      count: totalCount,
      materials: materials
    };
  }

  async getMaterialsByLevelName(levelName: string) {
    const [materials, totalCount] = await prisma.$transaction([
      prisma.material.findMany({
        where: { level: levelName },
        orderBy: { uploadedAt: 'desc' }
      }),
      prisma.material.count({
        where: { level: levelName }
      })
    ]);

    return {
      level: levelName,
      count: totalCount,
      materials: materials
    };
  }


  async getMaterialsByMaterialType(MaterialType: string) {
    const [materials, totalCount] = await prisma.$transaction([
      prisma.material.findMany({
        where: { materialType: MaterialType },
        orderBy: { uploadedAt: 'desc' }
      }),
      prisma.material.count({
        where: { materialType: MaterialType }
      })
    ]);

    return {
      materialType: MaterialType,
      count: totalCount,
      materials: materials
    };
  }



  async updateMaterial(materialId: string, userId: string, data: {
    title?: string;
    content?: string;
    group?: string;
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
            group: {
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
        group: true,
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