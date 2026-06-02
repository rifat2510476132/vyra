import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { success } from '../utils/response.util';
import { getPersonalizedFeed } from '../ai/feed.personalizer';
import { feedService } from '../services/feed.service';
import { prisma } from '../lib/prisma';

export const feedController = {
  async home(req: AuthRequest, res: Response) {
    const mood = String(req.query.mood ?? '');
    if (req.query.mood) {
      await prisma.profile.update({
        where: { userId: req.user!.userId },
        data: { mood: mood.toUpperCase() as never },
      });
    }
    const feed = await getPersonalizedFeed(req.user!.userId, mood);
    return success(res, feed);
  },

  async following(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '1'), 10);
    const feed = await feedService.getFeed(req.user!.userId, page);
    return success(res, feed);
  },

  async trending(_req: AuthRequest, res: Response) {
    const posts = await prisma.post.findMany({
      where: { deletedAt: null, visibility: 'PUBLIC' },
      include: {
        author: { include: { profile: true } },
        _count: { select: { reactions: true, comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return success(res, posts);
  },

  async explore(_req: AuthRequest, res: Response) {
    const galaxies = await prisma.interestGalaxy.findMany({
      orderBy: { trendingScore: 'desc' },
      take: 20,
    });
    return success(res, { galaxies });
  },
};
