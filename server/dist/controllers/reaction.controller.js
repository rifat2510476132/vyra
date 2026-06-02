"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactionController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const notification_dispatch_service_1 = require("../services/notification-dispatch.service");
exports.reactionController = {
    async react(req, res) {
        const postId = String(req.params.postId);
        const type = (req.body.reactionType ?? 'LIKE');
        const existing = await prisma_1.prisma.reaction.findUnique({
            where: { postId_userId: { postId, userId: req.user.userId } },
        });
        const reaction = await prisma_1.prisma.reaction.upsert({
            where: { postId_userId: { postId, userId: req.user.userId } },
            create: { postId, userId: req.user.userId, type },
            update: { type },
        });
        if (!existing) {
            const post = await prisma_1.prisma.post.findFirst({
                where: { id: postId, deletedAt: null },
                select: { authorId: true },
            });
            if (post && post.authorId !== req.user.userId) {
                const name = await (0, notification_dispatch_service_1.actorLabel)(req.user.userId);
                await (0, notification_dispatch_service_1.notifyUser)({
                    userId: post.authorId,
                    actorId: req.user.userId,
                    type: 'LIKE',
                    title: 'New reaction',
                    body: `${name} reacted to your post`,
                    referenceId: postId,
                });
            }
        }
        return (0, response_util_1.success)(res, reaction);
    },
    async emitVibe(req, res) {
        const postId = String(req.params.postId);
        await prisma_1.prisma.userActivity.create({
            data: {
                userId: req.user.userId,
                action: 'emit_vibe',
                entityType: 'post',
                entityId: postId,
                metadata: { energy: req.body.energy ?? 'positive' },
            },
        });
        return (0, response_util_1.success)(res, { ok: true });
    },
    async save(req, res) {
        const postId = String(req.params.postId);
        const saved = await prisma_1.prisma.savedPost.upsert({
            where: { postId_userId: { postId, userId: req.user.userId } },
            create: { postId, userId: req.user.userId },
            update: {},
        });
        return (0, response_util_1.success)(res, saved);
    },
};
//# sourceMappingURL=reaction.controller.js.map