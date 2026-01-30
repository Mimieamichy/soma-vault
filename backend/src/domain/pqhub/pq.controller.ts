// controllers/pqhub.controller.ts
import { Request, Response } from 'express';
import pqhubService from './pq.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class PQHubController {
  async askQuestion(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { question, materialIds } = req.body;

      if (!question) {
        res.status(400).json({ error: 'Question is required' });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await pqhubService.askQuestion({
        userId: req.user.userId,
        question,
        materialIds
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to answer question'
      });
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { limit, offset } = req.query;

      const history = await pqhubService.getHistory(
        req.user.userId,
        limit ? parseInt(limit as string) : 50,
        offset ? parseInt(offset as string) : 0
      );

      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get history'
      });
    }
  }

  async getQuestionById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const questionId = Array.isArray(id) ? id[0] : id;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!questionId) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
      }

      const question = await pqhubService.getQuestionById(questionId, req.user.userId);

      res.status(200).json({
        success: true,
        data: question
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Question not found'
      });
    }
  }

  async deleteQuestion(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const questionId = Array.isArray(id) ? id[0] : id;

      if (!questionId) {
        res.status(400).json({ error: 'Question ID is required' });
        return;
      }

      const result = await pqhubService.deleteQuestion(questionId, req.user.userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete question'
      });
    }
  }

  async clearHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await pqhubService.clearHistory(req.user.userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear history'
      });
    }
  }

  async searchHistory(req: AuthRequest, res: Response): Promise<void> {
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

      const results = await pqhubService.searchHistory(req.user.userId, q);

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      });
    }
  }

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const stats = await pqhubService.getStats(req.user.userId);

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

export default new PQHubController();