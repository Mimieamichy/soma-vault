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

      const { title, department } = req.body;


      const material = await materialService.uploadFile({
        userId: req.user.userId,
        title,
        file: req.file,
        department: department
      });

      res.status(201).json({
        success: true,
        data: material
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file'
      });
    }
  }

  async createTextNote(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, content, tags } = req.body;

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
        tags
      );

      res.status(201).json({
        success: true,
        data: material
      });
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

      const { archived, tags } = req.query;
      const archivedBool = archived === 'true' ? true : archived === 'false' ? false : undefined;
      const tagsArray = tags ? (tags as string).split(',') : undefined;

      const materials = await materialService.getUserMaterials(
        req.user.userId,
        archivedBool,
        tagsArray
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

  async updateMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content, tags, archived } = req.body;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const materialId = Array.isArray(id) ? id[0] : id;
      if (!materialId) {
        res.status(400).json({ error: 'Material ID is required' });
        return;
      }

      const material = await materialService.updateMaterial(materialId, req.user.userId, { title, content, tags, archived });

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