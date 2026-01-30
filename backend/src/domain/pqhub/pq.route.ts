// routes/pqhub.routes.ts
import { Router } from 'express';
import pqhubController from './pq.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Ask a question based on uploaded materials
router.post('/ask', (req, res) => pqhubController.askQuestion(req, res));

// Get question/answer history
router.get('/history', (req, res) => pqhubController.getHistory(req, res));

// Get PQ Hub stats
router.get('/stats', (req, res) => pqhubController.getStats(req, res));

// Search history
router.get('/search', (req, res) => pqhubController.searchHistory(req, res));

// Get specific question by ID
router.get('/:id', (req, res) => pqhubController.getQuestionById(req, res));

// Delete specific question
router.delete('/:id', (req, res) => pqhubController.deleteQuestion(req, res));

// Clear all history
router.delete('/history/clear', (req, res) => pqhubController.clearHistory(req, res));

export default router;