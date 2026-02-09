// routes/analytics.routes.ts
import { Router } from 'express';
import analyticsController from './analytics.controller';
import { authenticate, authorizeAdmin } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Only admins can view analytics
router.use(authenticate);
router.use(authorizeAdmin);

router.get('/users-by-plan', (req, res) => analyticsController.usersByPlan(req, res));
router.get('/materials-summary', (req, res) => analyticsController.materialsSummary(req, res));
router.get('/study-plans-summary', (req, res) => analyticsController.studyPlansSummary(req, res));
router.get('/payments-summary', (req, res) => analyticsController.paymentsSummary(req, res));
router.get('/qa-history-summary', (req, res) => analyticsController.qAHistorySummary(req, res));

export default router;
