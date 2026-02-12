// routes/auth.routes.ts
import { Router } from 'express';
import authController from './auth.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.get('/profile', authenticate, (req, res) => authController.getProfile(req, res));
authRouter.put('/profile', authenticate, (req, res) => authController.editProfile(req, res));
authRouter.post('/forgot-password', authenticate, (req, res) => authController.forgotPassword(req, res));
authRouter.post('/reset-password', authenticate, (req, res) => authController.resetPassword(req, res));

export default authRouter;