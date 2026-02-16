// controllers/studyplan.controller.ts
import { Request, Response } from 'express';
import studyPlanService from './study.service';
import { StudyFrequency, PlanStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class StudyPlanController {
  async createStudyPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {title, totalDays, studyFrequency, startDate} = req.body;
      const {id} = req.params

      const materialId = Array.isArray(id) ? id[0] : id;

      if (!materialId || !title || !totalDays || !studyFrequency) {
        res.status(400).json({
          error: 'Missing required fields: materialId, title, totalDays, studyFrequency'
        });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await studyPlanService.createStudyPlan({
        userId: req.user.userId,
        materialId,
        title,
        totalDays: parseInt(totalDays),
        studyFrequency: studyFrequency as StudyFrequency,
        startDate: startDate ? new Date(startDate) : new Date()
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create study plan'
      });
    }
  }


  async createStudyPlanWithFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { title, totalDays, studyFrequency, startDate, group, level, materialType } = req.body;

      if (!title || !totalDays || !studyFrequency) {
        res.status(400).json({
          error: 'Missing required fields: title, totalDays, studyFrequency'
        });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }


    const result = await studyPlanService.createStudyPlanWithFileUpload({
      userId: req.user.userId,
      title,
      totalDays: parseInt(totalDays),
      studyFrequency: studyFrequency as StudyFrequency,
      startDate: startDate ? new Date(startDate) : new Date(),
      file: req.file,
      group: group,
      level: level,
      materialType: materialType
    });

      res.status(201).json({success: true, data: result});
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create study plan with file'
      });
    }
  }

  async getStudyPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const studyPlanId = Array.isArray(id) ? id[0] : id;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!studyPlanId) {
        res.status(400).json({ error: 'Study plan ID is required' });
        return;
      }

      const studyPlan = await studyPlanService.getStudyPlan(studyPlanId, req.user.userId);

      res.status(200).json({
        success: true,
        data: studyPlan
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Study plan not found'
      });
    }
  }

  async getUserStudyPlans(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { status } = req.query;

      const studyPlans = await studyPlanService.getUserStudyPlans(
        req.user.userId,
        status as PlanStatus | undefined
      );

      res.status(200).json({
        success: true,
        data: studyPlans
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch study plans'
      });
    }
  }

  async updateStudyPlanStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const studyPlanId = Array.isArray(id) ? id[0] : id;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      if (!studyPlanId) {
        res.status(400).json({ error: 'Study plan ID is required' });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const studyPlan = await studyPlanService.updateStudyPlanStatus(studyPlanId, req.user.userId, status as PlanStatus);

      res.status(200).json({
        success: true,
        data: studyPlan
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update study plan'
      });
    }
  }

  async markFragmentComplete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { fragmentId } = req.params;
      const fragmentIdStr = Array.isArray(fragmentId) ? fragmentId[0] : fragmentId;
      const { timeSpent, notes } = req.body;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!fragmentIdStr) {
        res.status(400).json({ error: 'Fragment ID is required' });
        return;
      }

      const progress = await studyPlanService.markFragmentComplete(fragmentIdStr, req.user.userId);

      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mark fragment complete'
      });
    }
  }

  async getStudyProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const studyPlanId = Array.isArray(id) ? id[0] : id;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!studyPlanId) {
        res.status(400).json({ error: 'Study plan ID is required' });
        return;
      }

      const progress = await studyPlanService.getStudyProgress(studyPlanId, req.user.userId);

      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Study plan not found'
      });
    }
  }

  async deleteStudyPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const studyPlanId = Array.isArray(id) ? id[0] : id;

      if (!studyPlanId) {
        res.status(400).json({ error: 'Study plan ID is required' });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await studyPlanService.deleteStudyPlan(studyPlanId, req.user.userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete study plan'
      });
    }
  }
}

export default new StudyPlanController();