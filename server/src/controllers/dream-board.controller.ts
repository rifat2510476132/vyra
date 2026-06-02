import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';
import { vyraAiService } from '../services/vyra-ai.service';

export const dreamBoardController = {
  async list(req: AuthRequest, res: Response) {
    const boards = await prisma.dreamBoard.findMany({
      where: { userId: req.user!.userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
    return success(res, boards);
  },

  async create(req: AuthRequest, res: Response) {
    const goalText = String(req.body.goalText ?? req.body.title ?? '');
    if (!goalText) return fail(res, 'goalText required');
    const journey = await vyraAiService.lifeOrganizer(req.user!.userId, goalText);
    const board = await prisma.dreamBoard.create({
      data: {
        userId: req.user!.userId,
        title: String(req.body.title ?? goalText.slice(0, 80)),
        goalText,
        aiJourneyJson: { map: journey },
      },
    });
    return success(res, board, 201);
  },

  async updateProgress(req: AuthRequest, res: Response) {
    const id = String(req.params.id);
    const progress = Number(req.body.progress ?? 0);
    const board = await prisma.dreamBoard.update({
      where: { id, userId: req.user!.userId },
      data: { progress },
    });
    return success(res, board);
  },
};
