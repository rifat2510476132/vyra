import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';

export const notificationController = {
  async list(req: AuthRequest, res: Response) {
    const items = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return success(res, items);
  },

  async markRead(req: AuthRequest, res: Response) {
    await prisma.notification.updateMany({
      where: { id: String(req.params.id), userId: req.user!.userId },
      data: { isRead: true },
    });
    return success(res, { ok: true });
  },

  async markAllRead(req: AuthRequest, res: Response) {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });
    return success(res, { ok: true });
  },
};
