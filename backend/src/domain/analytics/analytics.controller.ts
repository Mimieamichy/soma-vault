// controllers/analytics.controller.ts
import { Request, Response } from 'express';
import analyticsService from './analytics.service';

class AnalyticsController {
  async usersByPlan(req: Request, res: Response) {
    try {
      const data = await analyticsService.getUsersByPlan();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  async materialsSummary(req: Request, res: Response) {
    try {
      const data = await analyticsService.getMaterialsSummary();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  async studyPlansSummary(req: Request, res: Response) {
    try {
      const data = await analyticsService.getStudyPlansSummary();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  async paymentsSummary(req: Request, res: Response) {
    try {
      const data = await analyticsService.getPaymentsSummary();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  async qAHistorySummary(req: Request, res: Response) {
    try {
      const data = await analyticsService.getQAHistorySummary();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}

export default new AnalyticsController();
