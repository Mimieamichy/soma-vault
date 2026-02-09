// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import authService from '../../domain/auth/auth.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};


export const authorizeAdmin = (
  req: AuthRequest, 
  res: Response,  
  next: NextFunction
): void => {
  if (req.user?.role !== 'ADMIN') { 
    res.status(403).json({
      success: false,
      error: 'Forbidden: Admins only'
    });
    return;
  }
  next();
}
