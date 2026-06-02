"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedController = void 0;
const response_util_1 = require("../utils/response.util");
const feed_personalizer_1 = require("../ai/feed.personalizer");
const feed_service_1 = require("../services/feed.service");
const prisma_1 = require("../lib/prisma");
exports.feedController = {
    async home(req, res) {
        const mood = String(req.query.mood ?? '');
        if (req.query.mood) {
            await prisma_1.prisma.profile.update({
                where: { userId: req.user.userId },
                data: { mood: mood.toUpperCase() },
            });
        }
        const feed = await (0, feed_personalizer_1.getPersonalizedFeed)(req.user.userId, mood);
        return (0, response_util_1.success)(res, feed);
    },
    async following(req, res) {
        const page = parseInt(String(req.query.page ?? '1'), 10);
        const feed = await feed_service_1.feedService.getFeed(req.user.userId, page);
        return (0, response_util_1.success)(res, feed);
    },
    async trending(_req, res) {
        const posts = await prisma_1.prisma.post.findMany({
            where: { deletedAt: null, visibility: 'PUBLIC' },
            include: {
                author: { include: { profile: true } },
                _count: { select: { reactions: true, comments: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        return (0, response_util_1.success)(res, posts);
    },
    async explore(_req, res) {
        const galaxies = await prisma_1.prisma.interestGalaxy.findMany({
            orderBy: { trendingScore: 'desc' },
            take: 20,
        });
        return (0, response_util_1.success)(res, { galaxies });
    },
};
//# sourceMappingURL=feed.controller.js.map