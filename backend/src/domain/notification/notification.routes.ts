import { Router } from 'express';
import notificationController from './notification.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const notificationRouter = Router();

notificationRouter.get('/', authenticate, (req, res) =>
  notificationController.list(req, res)
);

notificationRouter.patch('/:id/read', authenticate, (req, res) =>
  notificationController.markRead(req, res)
);

export default notificationRouter;
