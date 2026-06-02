import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';

export const communityController = {
  async list(_req: AuthRequest, res: Response) {
    const communities = await prisma.community.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { _count: { select: { members: true } } },
    });
    return success(res, communities);
  },

  async join(req: AuthRequest, res: Response) {
    const communityId = String(req.params.id);
    const member = await prisma.communityMember.upsert({
      where: {
        communityId_userId: {
          communityId,
          userId: req.user!.userId,
        },
      },
      create: {
        communityId,
        userId: req.user!.userId,
      },
      update: {},
    });
    return success(res, member);
  },
};
