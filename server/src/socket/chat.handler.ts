import { Server, Socket } from 'socket.io';
import { prisma } from '../lib/prisma';
import { actorLabel, notifyUser } from '../services/notification-dispatch.service';

export function registerChatHandlers(io: Server, socket: Socket & { userId: string }) {
  socket.on('chat:join', (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('chat:message', async (payload: {
    conversationId: string;
    content?: string;
    mediaUrl?: string;
    replyToId?: string;
  }) => {
    const message = await prisma.message.create({
      data: {
        conversationId: payload.conversationId,
        senderId: socket.userId,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        replyToId: payload.replyToId,
      },
      include: { sender: { include: { profile: true } }, reactions: true, replyTo: true },
    });

    await prisma.conversation.update({
      where: { id: payload.conversationId },
      data: { updatedAt: new Date() },
    });

    io.to(`conversation:${payload.conversationId}`).emit('chat:message', message);

    const members = await prisma.conversationMember.findMany({
      where: { conversationId: payload.conversationId },
      select: { userId: true },
    });
    const name = await actorLabel(socket.userId);
    const preview =
      payload.content?.slice(0, 120) ??
      (payload.mediaUrl ? 'Sent media' : 'New message');
    await Promise.all(
      members
        .filter((m) => m.userId !== socket.userId)
        .map((m) =>
          notifyUser({
            userId: m.userId,
            actorId: socket.userId,
            type: 'MESSAGE',
            title: name,
            body: preview,
            referenceId: payload.conversationId,
          })
        )
    );
  });

  socket.on('chat:react', async (payload: { messageId: string; reactionType: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' }) => {
    const msg = await prisma.message.findFirst({
      where: { id: payload.messageId, isDeleted: false },
      select: { id: true, conversationId: true },
    });
    if (!msg) return;
    const reaction = await prisma.messageReaction.upsert({
      where: { messageId_userId: { messageId: payload.messageId, userId: socket.userId } },
      create: {
        messageId: payload.messageId,
        userId: socket.userId,
        type: payload.reactionType,
      },
      update: { type: payload.reactionType, deletedAt: null },
    });
    io.to(`conversation:${msg.conversationId}`).emit('chat:reaction', {
      messageId: payload.messageId,
      userId: socket.userId,
      reactionType: reaction.type,
    });
  });

  socket.on('chat:edit', async (payload: { messageId: string; content: string }) => {
    const message = await prisma.message.findFirst({
      where: { id: payload.messageId, senderId: socket.userId, isDeleted: false },
    });
    if (!message) return;
    const updated = await prisma.message.update({
      where: { id: payload.messageId },
      data: { content: payload.content, isEdited: true },
    });
    io.to(`conversation:${updated.conversationId}`).emit('chat:edited', updated);
  });

  socket.on('chat:delete', async (payload: { messageId: string }) => {
    const message = await prisma.message.findFirst({
      where: { id: payload.messageId, senderId: socket.userId, isDeleted: false },
    });
    if (!message) return;
    const deleted = await prisma.message.update({
      where: { id: payload.messageId },
      data: { content: null, isDeleted: true, deletedAt: new Date() },
    });
    io.to(`conversation:${deleted.conversationId}`).emit('chat:deleted', {
      messageId: deleted.id,
    });
  });
}
