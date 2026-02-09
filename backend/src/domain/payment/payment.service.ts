import prisma from "../../lib/prisma";
import { AppError } from "../../shared/middlewares/error.middleware";
import { PaymentStatus, Plan } from "@prisma/client";

interface CreatePaymentInput {
  userId: string;
  amount: number;
  plan: Plan;
}


class PaymentService {
  async createPayment(data: CreatePaymentInput) {
    const { userId, amount, plan } = data;

    const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return prisma.payment.create({
      data: {
        userId,
        amount,
        plan,
        transactionId,
        paymentMethod: "TRANSFER",
        status: PaymentStatus.PENDING,
      },
    });
  }

  async confirmPayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new AppError("Payment already processed", 400);
    }

    const planConfig = this.getPlanConfig(payment.plan);

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.COMPLETED },
      }),
      prisma.user.update({
        where: { id: payment.userId },
        data: {
          plan: payment.plan,
          planExpiresAt: planConfig.expiresAt,
        },
      }),
    ]);

    prisma.notification.create({
      data: {
        userId: payment.userId,
        title: "Payment Confirmed",
        message: `Your payment for the ${payment.plan} plan has been confirmed. Your plan is now active until ${planConfig.expiresAt?.toDateString()}.`,
      },
    });

    return { success: true };
  }

  getPlanConfig(plan: Plan) {
    const now = new Date();

    switch (plan) {
      case "PRO":
        return {
          expiresAt: new Date(now.setMonth(now.getMonth() + 1)),
        };
      case "PREMIUM":
        return {
          expiresAt: new Date(now.setMonth(now.getMonth() + 1)),
        };
      default:
        return {
          expiresAt: null,
        };
    }
  }
}

export default new PaymentService();
