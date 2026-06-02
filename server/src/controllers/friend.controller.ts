import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success, fail } from '../utils/response.util';
import { actorLabel, notifyUser } from '../services/notification-dispatch.service';

export const friendController = {
  async sendRequest(req: AuthRequest, res: Response) {
    const receiverId = req.body.receiverId;
    const friend = await prisma.friend.create({
      data: { requesterId: req.user!.userId, receiverId, status: 'PENDING' },
    });
    const name = await actorLabel(req.user!.userId);
    await notifyUser({
      userId: receiverId,
      actorId: req.user!.userId,
      type: 'FRIEND_REQUEST',
      title: 'New friend request',
      body: `${name} wants to connect`,
      referenceId: friend.id,
    });
    return success(res, friend, 201);
  },

  async respond(req: AuthRequest, res: Response) {
    const { id, status } = req.body;
    if (status === 'ACCEPTED') {
      const row = await prisma.friend.findFirst({
        where: { id, receiverId: req.user!.userId },
      });
      const updated = await prisma.friend.updateMany({
        where: { id, receiverId: req.user!.userId },
        data: { status: 'ACCEPTED' },
      });
      if (row) {
        const name = await actorLabel(req.user!.userId);
        await notifyUser({
          userId: row.requesterId,
          actorId: req.user!.userId,
          type: 'FRIEND_REQUEST',
          title: 'Friend request accepted',
          body: `${name} accepted your request`,
          referenceId: row.id,
        });
      }
      return success(res, { updated: updated.count });
    }
    if (status === 'DECLINED') {
      const removed = await prisma.friend.deleteMany({
        where: { id, receiverId: req.user!.userId, status: 'PENDING' },
      });
      return success(res, { removed: removed.count });
    }
    return fail(res, 'Invalid status');
  },

  async list(req: AuthRequest, res: Response) {
    const friends = await prisma.friend.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: req.user!.userId },
          { receiverId: req.user!.userId },
        ],
      },
    });
    return success(res, friends);
  },
};
