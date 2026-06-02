"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const client_1 = require("@prisma/client");
const groupConversationName = (groupId) => `GROUP::${groupId}`;
async function ensureGroupConversation(groupId) {
    const group = await prisma_1.prisma.group.findFirst({
        where: { id: groupId, deletedAt: null },
        include: { members: true },
    });
    if (!group)
        return null;
    let conversation = await prisma_1.prisma.conversation.findFirst({
        where: {
            type: client_1.ConversationType.GROUP,
            name: groupConversationName(groupId),
            deletedAt: null,
        },
    });
    if (!conversation) {
        conversation = await prisma_1.prisma.conversation.create({
            data: {
                type: client_1.ConversationType.GROUP,
                name: groupConversationName(groupId),
            },
        });
    }
    await Promise.all(group.members.map((m) => prisma_1.prisma.conversationMember.upsert({
        where: { conversationId_userId: { conversationId: conversation.id, userId: m.userId } },
        create: { conversationId: conversation.id, userId: m.userId },
        update: { deletedAt: null },
    })));
    return conversation;
}
exports.groupController = {
    async list(req, res) {
        const groups = await prisma_1.prisma.group.findMany({
            where: {
                members: { some: { userId: req.user.userId } },
            },
            include: { members: true },
        });
        const withConversation = await Promise.all(groups.map(async (g) => {
            const c = await ensureGroupConversation(g.id);
            return { ...g, conversationId: c?.id ?? null };
        }));
        return (0, response_util_1.success)(res, withConversation);
    },
    async create(req, res) {
        const group = await prisma_1.prisma.group.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                ownerId: req.user.userId,
                members: {
                    create: { userId: req.user.userId, role: 'OWNER' },
                },
            },
            include: { members: true },
        });
        const conversation = await ensureGroupConversation(group.id);
        return (0, response_util_1.success)(res, { ...group, conversationId: conversation?.id ?? null }, 201);
    },
    async join(req, res) {
        const groupId = String(req.params.id);
        await prisma_1.prisma.groupMember.upsert({
            where: { groupId_userId: { groupId, userId: req.user.userId } },
            create: { groupId, userId: req.user.userId, role: 'MEMBER' },
            update: { deletedAt: null },
        });
        const conversation = await ensureGroupConversation(groupId);
        return (0, response_util_1.success)(res, { ok: true, conversationId: conversation?.id ?? null });
    },
};
//# sourceMappingURL=group.controller.js.map