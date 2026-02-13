// services/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from "crypto";
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
        planExpiresAt: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }


  async editProfile(userId: string, data: { name?: string; school?: string }) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.school && { school: data.school })
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        school: true,
        role: true,
        planExpiresAt: true,
        createdAt: true
      }
    });

    return updatedUser;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new AppError("Current password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return user;
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { message: "If email exists, reset link will be sent" };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      }
    });

    await this.sendMail(user.email,
      "Reset Your Password",
      `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `);

    return { message: "Reset link sent to email" };
  }


  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { message: "Password reset successful" };
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

  async sendMail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"SomaVault" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error("Email send error:", error);
      throw new Error("Failed to send email");
    }
  }

}

export default new AuthService();