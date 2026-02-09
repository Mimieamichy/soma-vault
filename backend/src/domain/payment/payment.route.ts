import { Router } from 'express';
import paymentController from './payment.controller';
import { authenticate, authorizeAdmin } from '../../shared/middlewares/auth.middleware';

const paymentRouter = Router();

paymentRouter.post('/', authenticate, (req, res) => paymentController.createPayment(req, res));


paymentRouter.use(authorizeAdmin);

paymentRouter.patch('/:paymentId/confirm', authenticate, (req, res) => paymentController.confirmPayment(req, res));

export default paymentRouter;
