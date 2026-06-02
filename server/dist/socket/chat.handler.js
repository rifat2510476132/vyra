"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = registerChatHandlers;
const prisma_1 = require("../lib/prisma");
const notification_dispatch_service_1 = require("../services/notification-dispatch.service");
function registerChatHandlers(io, socket) {
    socket.on('chat:join', (conversationId) => {
        socket.join(`conversation:${conversationId}`);
    });
    socket.on('chat:message', async (payload) => {
        const message = await prisma_1.prisma.message.create({
            data: {
                conversationId: payload.conversationId,
                senderId: socket.userId,
                content: payload.content,
                mediaUrl: payload.mediaUrl,
                replyToId: payload.replyToId,
            },
            include: { sender: { include: { profile: true } }, reactions: true, replyTo: true },
        });
        await prisma_1.prisma.conversation.update({
            where: { id: payload.conversationId },
            data: { updatedAt: new Date() },
        });
        io.to(`conversation:${payload.conversationId}`).emit('chat:message', message);
        const members = await prisma_1.prisma.conversationMember.findMany({
            where: { conversationId: payload.conversationId },
            select: { userId: true },
        });
        const name = await (0, notification_dispatch_service_1.actorLabel)(socket.userId);
        const preview = payload.content?.slice(0, 120) ??
            (payload.mediaUrl ? 'Sent media' : 'New message');
        await Promise.all(members
            .filter((m) => m.userId !== socket.userId)
            .map((m) => (0, notification_dispatch_service_1.notifyUser)({
            userId: m.userId,
            actorId: socket.userId,
            type: 'MESSAGE',
            title: name,
            body: preview,
            referenceId: payload.conversationId,
        })));
    });
    socket.on('chat:react', async (payload) => {
        const msg = await prisma_1.prisma.message.findFirst({
            where: { id: payload.messageId, isDeleted: false },
            select: { id: true, conversationId: true },
        });
        if (!msg)
            return;
        const reaction = await prisma_1.prisma.messageReaction.upsert({
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
    socket.on('chat:edit', async (payload) => {
        const message = await prisma_1.prisma.message.findFirst({
            where: { id: payload.messageId, senderId: socket.userId, isDeleted: false },
        });
        if (!message)
            return;
        const updated = await prisma_1.prisma.message.update({
            where: { id: payload.messageId },
            data: { content: payload.content, isEdited: true },
        });
        io.to(`conversation:${updated.conversationId}`).emit('chat:edited', updated);
    });
    socket.on('chat:delete', async (payload) => {
        const message = await prisma_1.prisma.message.findFirst({
            where: { id: payload.messageId, senderId: socket.userId, isDeleted: false },
        });
        if (!message)
            return;
        const deleted = await prisma_1.prisma.message.update({
            where: { id: payload.messageId },
            data: { content: null, isDeleted: true, deletedAt: new Date() },
        });
        io.to(`conversation:${deleted.conversationId}`).emit('chat:deleted', {
            messageId: deleted.id,
        });
    });
}
//# sourceMappingURL=chat.handler.js.map