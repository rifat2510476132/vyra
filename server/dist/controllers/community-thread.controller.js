"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityThreadController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.communityThreadController = {
    async list(req, res) {
        const communityId = String(req.params.communityId);
        const threads = await prisma_1.prisma.communityThread.findMany({
            where: { communityId, deletedAt: null },
            include: {
                author: { include: { profile: true } },
                _count: { select: { votes: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.success)(res, threads);
    },
    async create(req, res) {
        const communityId = String(req.params.communityId);
        const title = String(req.body.title ?? '').trim();
        const content = req.body.content ? String(req.body.content) : null;
        if (!title)
            return (0, response_util_1.fail)(res, 'title required', 400);
        const thread = await prisma_1.prisma.communityThread.create({
            data: {
                communityId,
                authorId: req.user.userId,
                title,
                content,
            },
            include: { author: { include: { profile: true } } },
        });
        return (0, response_util_1.success)(res, thread, 201);
    },
    async vote(req, res) {
        const threadId = String(req.params.threadId);
        const value = Number(req.body.value ?? 1);
        const vote = await prisma_1.prisma.communityVote.upsert({
            where: {
                threadId_userId: { threadId, userId: req.user.userId },
            },
            create: { threadId, userId: req.user.userId, value },
            update: { value },
        });
        const score = await prisma_1.prisma.communityVote.aggregate({
            where: { threadId },
            _sum: { value: true },
        });
        return (0, response_util_1.success)(res, { vote, score: score._sum.value ?? 0 });
    },
};
//# sourceMappingURL=community-thread.controller.js.map