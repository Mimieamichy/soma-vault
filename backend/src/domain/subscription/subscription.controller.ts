import { Request, Response } from 'express';
import subscriptionService from './subscription.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class SubscriptionController {
  async getMySubscription(req: AuthRequest, res: Response) {
    const data = await subscriptionService.getCurrent(req.user!.userId);
    res.json({ success: true, data });
  }
}

export default new SubscriptionController();
