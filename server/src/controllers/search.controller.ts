import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';

export const searchController = {
  async search(req: AuthRequest, res: Response) {
    const q = String(req.query.q ?? '').trim();
    if (!q) return success(res, { users: [], posts: [], galaxies: [] });

    const [users, posts, galaxies] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { profile: { displayName: { contains: q, mode: 'insensitive' } } },
          ],
        },
        include: { profile: true },
        take: 10,
      }),
      prisma.post.findMany({
        where: {
          deletedAt: null,
          content: { contains: q, mode: 'insensitive' },
        },
        take: 10,
      }),
      prisma.interestGalaxy.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 10,
      }),
    ]);

    return success(res, { users, posts, galaxies });
  },
};
