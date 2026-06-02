import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';

export const memoryController = {
  async universe(req: AuthRequest, res: Response) {
    const memories = await prisma.memoryTimeline.findMany({
      where: { userId: req.user!.userId, deletedAt: null },
      orderBy: { occurredAt: 'desc' },
    });
    return success(res, memories);
  },

  async capsule(req: AuthRequest, res: Response) {
    const { title, content, surfaceAt, emotionTag } = req.body;
    if (!title) return fail(res, 'title required');
    const memory = await prisma.memoryTimeline.create({
      data: {
        userId: req.user!.userId,
        title: String(title),
        content: content ? String(content) : null,
        emotionTag: emotionTag ? String(emotionTag) : null,
        clusterType: 'capsule',
        surfaceAt: surfaceAt ? new Date(surfaceAt) : null,
        occurredAt: new Date(),
      },
    });
    return success(res, memory, 201);
  },
};
