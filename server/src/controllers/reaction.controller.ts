import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';
import { ReactionType } from '@prisma/client';
import { actorLabel, notifyUser } from '../services/notification-dispatch.service';

export const reactionController = {
  async react(req: AuthRequest, res: Response) {
    const postId = String(req.params.postId);
    const type = (req.body.reactionType ?? 'LIKE') as ReactionType;
    const existing = await prisma.reaction.findUnique({
      where: { postId_userId: { postId, userId: req.user!.userId } },
    });
    const reaction = await prisma.reaction.upsert({
      where: { postId_userId: { postId, userId: req.user!.userId } },
      create: { postId, userId: req.user!.userId, type },
      update: { type },
    });
    if (!existing) {
      const post = await prisma.post.findFirst({
        where: { id: postId, deletedAt: null },
        select: { authorId: true },
      });
      if (post && post.authorId !== req.user!.userId) {
        const name = await actorLabel(req.user!.userId);
        await notifyUser({
          userId: post.authorId,
          actorId: req.user!.userId,
          type: 'LIKE',
          title: 'New reaction',
          body: `${name} reacted to your post`,
          referenceId: postId,
        });
      }
    }
    return success(res, reaction);
  },

  async emitVibe(req: AuthRequest, res: Response) {
    const postId = String(req.params.postId);
    await prisma.userActivity.create({
      data: {
        userId: req.user!.userId,
        action: 'emit_vibe',
        entityType: 'post',
        entityId: postId,
        metadata: { energy: req.body.energy ?? 'positive' },
      },
    });
    return success(res, { ok: true });
  },

  async save(req: AuthRequest, res: Response) {
    const postId = String(req.params.postId);
    const saved = await prisma.savedPost.upsert({
      where: { postId_userId: { postId, userId: req.user!.userId } },
      create: { postId, userId: req.user!.userId },
      update: {},
    });
    return success(res, saved);
  },
};
