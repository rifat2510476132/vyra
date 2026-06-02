import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../lib/prisma';
import { success } from '../utils/response.util';
import { ConversationType } from '@prisma/client';

const groupConversationName = (groupId: string) => `GROUP::${groupId}`;

async function ensureGroupConversation(groupId: string) {
  const group = await prisma.group.findFirst({
    where: { id: groupId, deletedAt: null },
    include: { members: true },
  });
  if (!group) return null;

  let conversation = await prisma.conversation.findFirst({
    where: {
      type: ConversationType.GROUP,
      name: groupConversationName(groupId),
      deletedAt: null,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        name: groupConversationName(groupId),
      },
    });
  }

  await Promise.all(
    group.members.map((m) =>
      prisma.conversationMember.upsert({
        where: { conversationId_userId: { conversationId: conversation!.id, userId: m.userId } },
        create: { conversationId: conversation!.id, userId: m.userId },
        update: { deletedAt: null },
      })
    )
  );

  return conversation;
}

export const groupController = {
  async list(req: AuthRequest, res: Response) {
    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId: req.user!.userId } },
      },
      include: { members: true },
    });
    const withConversation = await Promise.all(
      groups.map(async (g) => {
        const c = await ensureGroupConversation(g.id);
        return { ...g, conversationId: c?.id ?? null };
      })
    );
    return success(res, withConversation);
  },

  async create(req: AuthRequest, res: Response) {
    const group = await prisma.group.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        ownerId: req.user!.userId,
        members: {
          create: { userId: req.user!.userId, role: 'OWNER' },
        },
      },
      include: { members: true },
    });
    const conversation = await ensureGroupConversation(group.id);
    return success(res, { ...group, conversationId: conversation?.id ?? null }, 201);
  },

  async join(req: AuthRequest, res: Response) {
    const groupId = String(req.params.id);
    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId: req.user!.userId } },
      create: { groupId, userId: req.user!.userId, role: 'MEMBER' },
      update: { deletedAt: null },
    });
    const conversation = await ensureGroupConversation(groupId);
    return success(res, { ok: true, conversationId: conversation?.id ?? null });
  },
};
