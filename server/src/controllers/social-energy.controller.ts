import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';

export const socialEnergyController = {
  async me(req: AuthRequest, res: Response) {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
    });
    const logs = await prisma.socialEnergyLog.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return success(res, { score: profile?.socialEnergyScore ?? 50, logs });
  },

  async leaderboard(_req: AuthRequest, res: Response) {
    const top = await prisma.profile.findMany({
      orderBy: { socialEnergyScore: 'desc' },
      take: 20,
      include: { user: { select: { username: true } } },
    });
    return success(res, top);
  },

  async applyAction(req: AuthRequest, res: Response) {
    const action = String(req.body.action ?? 'content_created');
    const delta = Number(req.body.delta ?? 5);
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
    });
    const current = profile?.socialEnergyScore ?? 50;
    const newScore = Math.max(0, Math.min(100, current + delta));
    await prisma.$transaction([
      prisma.profile.update({
        where: { userId: req.user!.userId },
        data: { socialEnergyScore: newScore },
      }),
      prisma.socialEnergyLog.create({
        data: {
          userId: req.user!.userId,
          action,
          delta,
          newScore,
        },
      }),
    ]);
    return success(res, { newScore });
  },
};
