import { Request, Response } from 'express';
import notificationService from './notification.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class NotificationController {
  async list(req: AuthRequest, res: Response) {
    const data = await notificationService.getUserNotifications(req.user!.userId);
    res.json({ success: true, data });
  }

  async markRead(req: Request, res: Response) {
    const { id } = req.params;

    const notificationId = Array.isArray(id) ? id[0] : id;

    if (!notificationId) {
      return res.status(400).json({ success: false, error: 'Notification ID is required' });
    }
    await notificationService.markAsRead(notificationId);
    res.json({ success: true });
  }
}

export default new NotificationController();
