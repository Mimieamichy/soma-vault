// controllers/auth.controller.ts
import { Request, Response } from 'express';
import authService from './auth.service';
import { token } from 'morgan';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, school} = req.body;

      if (!email || !password) {
        res.status(400).json({ 
          error: 'Email and password are required' 
        });
        return;
      }

      const role =  'STUDENT';

      const result = await authService.register({ email, password, name, role, school });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
       console.log(error);
      res.status(400).json({ 
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ 
          error: 'Email and password are required' 
        });
        return;
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await authService.getProfile(req.user.userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'User not found'
      });
    }
  }

  async editProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const data = req.body
      
      const user = await authService.editProfile(req.user.userId, data);

      res.status(200).json({success: true, data: user});
    } catch (error) {
      res.status(404).json({success: false, error: error instanceof Error ? error.message : 'User not found'});
    }
  }


  async forgotPassword(req: AuthRequest, res: Response): Promise<void> {
    try {

      const {email} = req.body
      
      const user = await authService.forgotPassword(email);

      res.status(200).json({success: true, data: user});
    } catch (error) {
      res.status(404).json({success: false, error: error instanceof Error ? error.message : 'User not found'});
    }
  }


  async resetPassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      
      const {newPassword} = req.body
      const token = req.query.token

      if (!token || typeof token !== "string") {
        res.status(400).json({ error: 'Invalid or missing token' });
        return;
      }
      
      const user = await authService.resetPassword(token, newPassword);

      res.status(200).json({success: true, data: user});
    } catch (error) {
      res.status(404).json({success: false, error: error instanceof Error ? error.message : 'User not found'});
    }
  }
}

export default new AuthController();