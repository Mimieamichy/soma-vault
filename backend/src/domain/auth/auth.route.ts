// routes/auth.routes.ts
import { Router } from 'express';
import authController from './auth.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.get('/profile', authenticate, (req, res) => authController.getProfile(req, res));

export default authRouter;