import { Response } from 'express';

import { ConversationType } from '@prisma/client';

import { AuthRequest } from '../middleware/auth.middleware';

import { prisma } from '../lib/prisma';

import { success, fail } from '../utils/response.util';

import { getIo } from '../socket/io-holder';



export const messageController = {

  async conversations(req: AuthRequest, res: Response) {

    const memberships = await prisma.conversationMember.findMany({

      where: { userId: req.user!.userId },

      include: {

        conversation: {

          include: {

            messages: { orderBy: { createdAt: 'desc' }, take: 1 },

            members: { include: { user: { include: { profile: true } } } },

          },

        },

      },

    });

    return success(res, memberships);

  },



  async messages(req: AuthRequest, res: Response) {

    const conversationId = String(req.params.conversationId);

    const member = await prisma.conversationMember.findFirst({

      where: { conversationId, userId: req.user!.userId },

    });

    if (!member) return fail(res, 'Not a member', 403);



    const messages = await prisma.message.findMany({

      where: { conversationId, isDeleted: false },

      orderBy: { createdAt: 'asc' },

      take: 100,

      include: {
        sender: { include: { profile: true } },
        reactions: true,
        replyTo: { select: { id: true, content: true, senderId: true } },
      },

    });

    return success(res, messages);

  },



  async markRead(req: AuthRequest, res: Response) {

    const conversationId = String(req.params.conversationId);

    await prisma.conversationMember.updateMany({

      where: { conversationId, userId: req.user!.userId },

      data: { lastReadAt: new Date() },

    });

    const io = getIo();

    io?.to(`conversation:${conversationId}`).emit('chat:read', {

      conversationId,

      userId: req.user!.userId,

      readAt: new Date().toISOString(),

    });

    return success(res, { ok: true });

  },



  async startDirect(req: AuthRequest, res: Response) {

    const otherUserId = String(req.body.userId ?? '');

    if (!otherUserId) return fail(res, 'userId required', 400);

    if (otherUserId === req.user!.userId) return fail(res, 'Cannot chat with self', 400);



    const existing = await prisma.conversation.findFirst({

      where: {

        type: ConversationType.DIRECT,

        deletedAt: null,

        AND: [

          { members: { some: { userId: req.user!.userId } } },

          { members: { some: { userId: otherUserId } } },

        ],

      },

      include: { members: true },

    });



    if (existing && existing.members.length === 2) {

      return success(res, existing);

    }



    const conversation = await prisma.conversation.create({

      data: {

        type: ConversationType.DIRECT,

        members: {

          create: [

            { userId: req.user!.userId },

            { userId: otherUserId },

          ],

        },

      },

      include: { members: { include: { user: { include: { profile: true } } } } },

    });

    return success(res, conversation, 201);

  },

};


