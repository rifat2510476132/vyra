import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    const username = String(req.params.username);
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
        profile: true,
        posts: {
          where: { deletedAt: null },
          take: 12,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) return fail(res, 'Profile not found', 404);
    return success(res, user);
  },

  async updateProfile(req: AuthRequest, res: Response) {
    const profile = await prisma.profile.update({
      where: { userId: req.user!.userId },
      data: {
        displayName: req.body.displayName,
        bio: req.body.bio,
        avatarUrl: req.body.avatarUrl,
        coverUrl: req.body.coverUrl,
      },
    });
    return success(res, profile);
  },

  async setMood(req: AuthRequest, res: Response) {
    const profile = await prisma.profile.update({
      where: { userId: req.user!.userId },
      data: { mood: req.body.mood },
    });
    return success(res, profile);
  },

  async setPresence(req: AuthRequest, res: Response) {
    const profile = await prisma.profile.update({
      where: { userId: req.user!.userId },
      data: { smartPresence: req.body.presence },
    });
    return success(res, profile);
  },
};
