// controllers/material.controller.ts
import { Request, Response } from 'express';
import materialService from './materials.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class MaterialController {
  async uploadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, group, level, materialType } = req.body;


      const material = await materialService.uploadFile({
        userId: req.user.userId,
        title,
        file: req.file,
        group: group,
        level: level,
        materialType: materialType
      });

      res.status(201).json({success: true, data: material});
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      });
    }
  }

  async createTextNote(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, content, group, level, materialType } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const material = await materialService.createTextNote(
        req.user.userId,
        title,
        content,
        group,
        level,
        materialType
      );

      res.status(201).json({success: true, data: material});
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create note'
      });
    }
  }

  async getMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const materialId = Array.isArray(id) ? id[0] : id;
      if (!materialId) {
        res.status(400).json({ error: 'Material ID is required' });
        return;
      }

      const material = await materialService.getMaterial(materialId, req.user.userId);

      res.status(200).json({
        success: true,
        data: material
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Material not found'
      });
    }
  }

  async getUserMaterials(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { archived, group } = req.query;
      const archivedBool = archived === 'true' ? true : archived === 'false' ? false : undefined;
      const groupStr = group ? (group as string) : '';

      const materials = await materialService.getUserMaterials(
        req.user.userId,
        groupStr,
        archivedBool
      );

      res.status(200).json({
        success: true,
        data: materials
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch materials'
      });
    }
  }


  async getAllMaterials(req: AuthRequest, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const materials = await materialService.getAllMaterials(filters);

      res.status(200).json({
        success: true,
        data: materials
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch all materials'
      });
    }
  }

  async getMaterialsBygroupName(req: AuthRequest, res: Response): Promise<void>{
    const groupName = req.body.groupName;

    if (!groupName) {
      res.status(400).json({ error: 'group name is required' });
      return;
    }
    try {
      const groups = await materialService.getMaterialsBygroupName(groupName);
      res.status(200).json({success: true, data: groups});
    }
    catch (error) {
      res.status(400).json({success: false, error: error instanceof Error ? error.message : 'Failed to fetch materials by groups'});
    }
  };


  
  async getMaterialsByLevelName(req: AuthRequest, res: Response): Promise<void>{
    const levelName = req.body.levelName;

    if (!levelName) {
      res.status(400).json({ error: 'Level name is required' });
      return;
    }
    try {
      const groups = await materialService.getMaterialsByLevelName(levelName);
      res.status(200).json({success: true, data: groups});
    }
    catch (error) {
      res.status(400).json({success: false, error: error instanceof Error ? error.message : 'Failed to fetch materials by level'});
    }
  };


  async getMaterialsByMaterialType(req: AuthRequest, res: Response): Promise<void>{
    const materialType = req.body.materialType;

    if (!materialType) {
      res.status(400).json({ error: 'Material type is required' });
      return;
    }
    try {
      const groups = await materialService.getMaterialsByMaterialType(materialType);
      res.status(200).json({success: true, data: groups});
    }
    catch (error) {
      res.status(400).json({success: false, error: error instanceof Error ? error.message : 'Failed to fetch materials by material type'});
    }
  };

  

  async getMaterialsBySchoolName(req: AuthRequest, res: Response): Promise<void>{
    const schoolName = req.body.schoolName;

    if (!schoolName) {
      res.status(400).json({ error: 'School Name is required' });
      return;
    }
    try {
      const groups = await materialService.getMaterialsBySchoolName(schoolName);
      res.status(200).json({success: true, data: groups});
    }
    catch (error) {
      res.status(400).json({success: false, error: error instanceof Error ? error.message : 'Failed to fetch materials by school'});
    }
  };


  async updateMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, group, archived } = req.body;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const materialId = Array.isArray(id) ? id[0] : id;
      if (!materialId) {
        res.status(400).json({ error: 'Material ID is required' });
        return;
      }

      const material = await materialService.updateMaterial(materialId, req.user.userId, { title, content, group, archived });

      res.status(200).json({
        success: true,
        data: material
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update material'
      });
    }
  }

  async archiveMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const materialId = Array.isArray(id) ? id[0] : id;
      if (!materialId) {
        res.status(400).json({ error: 'Material ID is required' });
        return;
      }

      const material = await materialService.archiveMaterial(materialId, req.user.userId);

      res.status(200).json({
        success: true,
        data: material
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to archive material'
      });
    }
  }

  async unarchiveMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const materialId = Array.isArray(id) ? id[0] : id;
      if (!materialId) {
        res.status(400).json({ error: 'Material ID is required' });
        return;
      }

      const material = await materialService.unarchiveMaterial(materialId, req.user.userId);

      res.status(200).json({
        success: true,
        data: material
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unarchive material'
      });
    }
  }

  async deleteMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const materialId = Array.isArray(id) ? id[0] : id;
      if (!materialId) {
        res.status(400).json({ error: 'Material ID is required' });
        return;
      }

      const result = await materialService.deleteMaterial(materialId, req.user.userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete material'
      });
    }
  }

  async searchMaterials(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const materials = await materialService.searchMaterials(req.user.userId, q);

      res.status(200).json({
        success: true,
        data: materials
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      });
    }
  }

  async getMaterialStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const stats = await materialService.getMaterialStats(req.user.userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get stats'
      });
    }
  }

}

export default new MaterialController();