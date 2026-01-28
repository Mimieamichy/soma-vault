// services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AppError } from "../../shared/middlewares/error.middleware";

import prisma from '../../lib/prisma';


interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;  
  school?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    role: string;
    school: string | null;
  };
  token: string;
}

interface TokenPayload {
  userId: string;
  role: string;
}

class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, name, role, school } = data;

    if (data.role === 'STUDENT' && !data.school) {
      throw new AppError('School is required for students', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        school: school || null,
        plan: 'FREE',
        usageQuota: 10
      }
    });

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        school: user.school,
      },
      token
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        school: user.school,
      },
      token
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        school: true,
        role: true,
        usageQuota: true,
        planExpiresAt: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}

export default new AuthService();