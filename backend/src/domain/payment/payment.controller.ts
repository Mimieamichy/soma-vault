import { Request, Response } from 'express';
import paymentService from './payment.service';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

class PaymentController {
  async createPayment(req: AuthRequest, res: Response) {
    try {
      const { amount, plan } = req.body;

      const payment = await paymentService.createPayment({
        userId: req.user!.userId,
        amount,
        plan,
      });

      res.status(201).json({ success: true, data: payment });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const paymentId = Array.isArray(id) ? id[0] : id;

      if (!paymentId) {
        return res.status(400).json({ success: false, error: 'Payment ID is required' });
      }

      const result = await paymentService.confirmPayment(paymentId);

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Confirmation failed'
      });
    }
  }
}

export default new PaymentController();
