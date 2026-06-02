import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';

export const galaxyController = {
  async list(_req: AuthRequest, res: Response) {
    const galaxies = await prisma.interestGalaxy.findMany({
      orderBy: { trendingScore: 'desc' },
      take: 50,
    });
    return success(res, galaxies);
  },

  async trending(_req: AuthRequest, res: Response) {
    const galaxies = await prisma.interestGalaxy.findMany({
      orderBy: [{ trendingScore: 'desc' }, { memberCount: 'desc' }],
      take: 20,
    });
    return success(res, galaxies);
  },
};
