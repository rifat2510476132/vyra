import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';

export const realityBoardController = {
  async list(req: AuthRequest, res: Response) {
    const boards = await prisma.realityBoard.findMany({
      where: {
        deletedAt: null,
        OR: [{ userId: req.user!.userId }, { isPublic: true }],
      },
      orderBy: { updatedAt: 'desc' },
    });
    return success(res, boards);
  },

  async create(req: AuthRequest, res: Response) {
    const title = String(req.body.title ?? '').trim();
    const visionText = String(req.body.visionText ?? req.body.vision ?? '').trim();
    if (!title || !visionText) return fail(res, 'title and visionText required', 400);

    const board = await prisma.realityBoard.create({
      data: {
        userId: req.user!.userId,
        title,
        visionText,
        pillarsJson: req.body.pillars ?? req.body.pillarsJson ?? [],
        isPublic: Boolean(req.body.isPublic),
      },
    });
    return success(res, board, 201);
  },

  async update(req: AuthRequest, res: Response) {
    const id = String(req.params.id);
    const board = await prisma.realityBoard.updateMany({
      where: { id, userId: req.user!.userId },
      data: {
        title: req.body.title,
        visionText: req.body.visionText,
        pillarsJson: req.body.pillars ?? req.body.pillarsJson,
        isPublic: req.body.isPublic,
      },
    });
    return success(res, { updated: board.count });
  },
};
