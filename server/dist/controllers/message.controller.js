"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const io_holder_1 = require("../socket/io-holder");
exports.messageController = {
    async conversations(req, res) {
        const memberships = await prisma_1.prisma.conversationMember.findMany({
            where: { userId: req.user.userId },
            include: {
                conversation: {
                    include: {
                        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
                        members: { include: { user: { include: { profile: true } } } },
                    },
                },
            },
        });
        return (0, response_util_1.success)(res, memberships);
    },
    async messages(req, res) {
        const conversationId = String(req.params.conversationId);
        const member = await prisma_1.prisma.conversationMember.findFirst({
            where: { conversationId, userId: req.user.userId },
        });
        if (!member)
            return (0, response_util_1.fail)(res, 'Not a member', 403);
        const messages = await prisma_1.prisma.message.findMany({
            where: { conversationId, isDeleted: false },
            orderBy: { createdAt: 'asc' },
            take: 100,
            include: {
                sender: { include: { profile: true } },
                reactions: true,
                replyTo: { select: { id: true, content: true, senderId: true } },
            },
        });
        return (0, response_util_1.success)(res, messages);
    },
    async markRead(req, res) {
        const conversationId = String(req.params.conversationId);
        await prisma_1.prisma.conversationMember.updateMany({
            where: { conversationId, userId: req.user.userId },
            data: { lastReadAt: new Date() },
        });
        const io = (0, io_holder_1.getIo)();
        io?.to(`conversation:${conversationId}`).emit('chat:read', {
            conversationId,
            userId: req.user.userId,
            readAt: new Date().toISOString(),
        });
        return (0, response_util_1.success)(res, { ok: true });
    },
    async startDirect(req, res) {
        const otherUserId = String(req.body.userId ?? '');
        if (!otherUserId)
            return (0, response_util_1.fail)(res, 'userId required', 400);
        if (otherUserId === req.user.userId)
            return (0, response_util_1.fail)(res, 'Cannot chat with self', 400);
        const existing = await prisma_1.prisma.conversation.findFirst({
            where: {
                type: client_1.ConversationType.DIRECT,
                deletedAt: null,
                AND: [
                    { members: { some: { userId: req.user.userId } } },
                    { members: { some: { userId: otherUserId } } },
                ],
            },
            include: { members: true },
        });
        if (existing && existing.members.length === 2) {
            return (0, response_util_1.success)(res, existing);
        }
        const conversation = await prisma_1.prisma.conversation.create({
            data: {
                type: client_1.ConversationType.DIRECT,
                members: {
                    create: [
                        { userId: req.user.userId },
                        { userId: otherUserId },
                    ],
                },
            },
            include: { members: { include: { user: { include: { profile: true } } } } },
        });
        return (0, response_util_1.success)(res, conversation, 201);
    },
};
//# sourceMappingURL=message.controller.js.map