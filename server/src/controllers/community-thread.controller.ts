import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';

export const communityThreadController = {
  async list(req: AuthRequest, res: Response) {
    const communityId = String(req.params.communityId);
    const threads = await prisma.communityThread.findMany({
      where: { communityId, deletedAt: null },
      include: {
        author: { include: { profile: true } },
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, threads);
  },

  async create(req: AuthRequest, res: Response) {
    const communityId = String(req.params.communityId);
    const title = String(req.body.title ?? '').trim();
    const content = req.body.content ? String(req.body.content) : null;
    if (!title) return fail(res, 'title required', 400);

    const thread = await prisma.communityThread.create({
      data: {
        communityId,
        authorId: req.user!.userId,
        title,
        content,
      },
      include: { author: { include: { profile: true } } },
    });
    return success(res, thread, 201);
  },

  async vote(req: AuthRequest, res: Response) {
    const threadId = String(req.params.threadId);
    const value = Number(req.body.value ?? 1);
    const vote = await prisma.communityVote.upsert({
      where: {
        threadId_userId: { threadId, userId: req.user!.userId },
      },
      create: { threadId, userId: req.user!.userId, value },
      update: { value },
    });
    const score = await prisma.communityVote.aggregate({
      where: { threadId },
      _sum: { value: true },
    });
    return success(res, { vote, score: score._sum.value ?? 0 });
  },
};
