import { Router } from 'express';
import subscriptionController from './subscription.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const subscriptionRouter = Router();

subscriptionRouter.get(
  '/me',
  authenticate,
  (req, res) => subscriptionController.getMySubscription(req, res)
);

export default subscriptionRouter;
