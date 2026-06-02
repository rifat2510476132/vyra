"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const notification_dispatch_service_1 = require("../services/notification-dispatch.service");
exports.commentController = {
    async list(req, res) {
        const postId = String(req.params.postId);
        const comments = await prisma_1.prisma.comment.findMany({
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
        return (0, response_util_1.success)(res, comments);
    },
    async create(req, res) {
        const postId = String(req.params.postId);
        const content = String(req.body.content ?? '');
        if (!content)
            return (0, response_util_1.fail)(res, 'content required');
        const post = await prisma_1.prisma.post.findFirst({
            where: { id: postId, deletedAt: null },
            select: { authorId: true },
        });
        const comment = await prisma_1.prisma.comment.create({
            data: {
                postId,
                authorId: req.user.userId,
                parentId: req.body.parentId ? String(req.body.parentId) : null,
                content,
            },
            include: { author: { include: { profile: true } } },
        });
        if (post && post.authorId !== req.user.userId) {
            const name = await (0, notification_dispatch_service_1.actorLabel)(req.user.userId);
            await (0, notification_dispatch_service_1.notifyUser)({
                userId: post.authorId,
                actorId: req.user.userId,
                type: 'COMMENT',
                title: 'New comment',
                body: `${name} commented on your post`,
                referenceId: postId,
            });
        }
        return (0, response_util_1.success)(res, comment, 201);
    },
};
//# sourceMappingURL=comment.controller.js.map