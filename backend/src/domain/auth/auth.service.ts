// services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RegisterInput {
  email: string;
  password: string;
  name: string;
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
  };
  token: string;
}

interface TokenPayload {
  userId: string;
}

class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        plan: 'FREE',
        usageQuota: 10
      }
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan
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
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan
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
        usageQuota: true,
        planExpiresAt: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new AuthService();