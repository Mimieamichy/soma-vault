import prisma from '../../lib/prisma';

class SubscriptionService {
  async getCurrent(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        planExpiresAt: true,
      }
    });
  }
}

export default new SubscriptionService();
