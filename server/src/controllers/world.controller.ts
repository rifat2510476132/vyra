import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';

export const worldController = {
  async list(_req: AuthRequest, res: Response) {
    const worlds = await prisma.vyraWorld.findMany({
      where: { deletedAt: null, isPublic: true },
      orderBy: { memberCount: 'desc' },
    });
    return success(res, worlds);
  },

  async join(req: AuthRequest, res: Response) {
    const worldId = String(req.params.id);
    const member = await prisma.worldMember.upsert({
      where: {
        worldId_userId: { worldId, userId: req.user!.userId },
      },
      create: { worldId, userId: req.user!.userId },
      update: {},
    });
    await prisma.vyraWorld.update({
      where: { id: worldId },
      data: { memberCount: { increment: 1 } },
    });
    return success(res, member);
  },

  async detail(req: AuthRequest, res: Response) {
    const slug = String(req.params.slug);
    const world = await prisma.vyraWorld.findFirst({
      where: { slug, deletedAt: null },
      include: { members: { take: 20, include: { user: { include: { profile: true } } } } },
    });
    if (!world) return fail(res, 'World not found', 404);
    return success(res, world);
  },
};
