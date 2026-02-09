import prisma from '../../lib/prisma';

class NotificationService {
  async create(userId: string, title: string, message: string) {
    return prisma.notification.create({
      data: { userId, title, message }
    });
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
}

export default new NotificationService();
