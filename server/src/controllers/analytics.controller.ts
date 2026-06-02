import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';
import { detectTrendingGalaxies } from '../ai/trend.detector';

export const analyticsController = {
  async creator(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const [postCount, reactionCount] = await Promise.all([
      prisma.post.count({ where: { authorId: userId, deletedAt: null } }),
      prisma.reaction.count({ where: { post: { authorId: userId } } }),
    ]);
    return success(res, {
      posts: postCount,
      reactions: reactionCount,
    });
  },

  async trends(_req: AuthRequest, res: Response) {
    const trends = await detectTrendingGalaxies();
    return success(res, trends);
  },
};
