// services/analytics.service.ts
import prisma from '../../lib/prisma';

class AnalyticsService {
  // Count users grouped by plan
  async getUsersByPlan() {
    const users = await prisma.user.groupBy({
      by: ['plan'],
      _count: { id: true },
    });
    return users;
  }

  // Total materials uploaded
  async getMaterialsSummary() {
    const total = await prisma.material.count();
    const byType = await prisma.material.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    return { total, byType };
  }

  // Study plan summary
  async getStudyPlansSummary() {
    const total = await prisma.studyPlan.count();
    const byStatus = await prisma.studyPlan.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    return { total, byStatus };
  }

  // Payments summary
  async getPaymentsSummary() {
    const totalAmount = await prisma.payment.aggregate({
      _sum: { amount: true },
    });

    const byStatus = await prisma.payment.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return { totalAmount, byStatus };
  }

  // QAHistory summary
  async getQAHistorySummary() {
    const total = await prisma.qAHistory.count();
    const byUser = await prisma.qAHistory.groupBy({
      by: ['userId'],
      _count: { id: true },
    });

    return { total, byUser };
  }
}

export default new AnalyticsService();
