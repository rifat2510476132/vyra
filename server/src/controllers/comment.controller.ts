import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';
import { actorLabel, notifyUser } from '../services/notification-dispatch.service';

export const commentController = {
  async list(req: AuthRequest, res: Response) {
    const postId = String(req.params.postId);
    const comments = await prisma.comment.findMany({
      where: { postId, deletedAt: null, parentId: null },
      include: {
        author: { include: { profile: true } },
        replies: {
          where: { deletedAt: null },
          include: { author: { include: { profile: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, comments);
  },

  async create(req: AuthRequest, res: Response) {
    const postId = String(req.params.postId);
    const content = String(req.body.content ?? '');
    if (!content) return fail(res, 'content required');
    const post = await prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { authorId: true },
    });
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: req.user!.userId,
        parentId: req.body.parentId ? String(req.body.parentId) : null,
        content,
      },
      include: { author: { include: { profile: true } } },
    });
    if (post && post.authorId !== req.user!.userId) {
      const name = await actorLabel(req.user!.userId);
      await notifyUser({
        userId: post.authorId,
        actorId: req.user!.userId,
        type: 'COMMENT',
        title: 'New comment',
        body: `${name} commented on your post`,
        referenceId: postId,
      });
    }
    return success(res, comment, 201);
  },
};
