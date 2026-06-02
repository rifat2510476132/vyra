"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const trend_detector_1 = require("../ai/trend.detector");
exports.analyticsController = {
    async creator(req, res) {
        const userId = req.user.userId;
        const [postCount, reactionCount] = await Promise.all([
            prisma_1.prisma.post.count({ where: { authorId: userId, deletedAt: null } }),
            prisma_1.prisma.reaction.count({ where: { post: { authorId: userId } } }),
        ]);
        return (0, response_util_1.success)(res, {
            posts: postCount,
            reactions: reactionCount,
        });
    },
    async trends(_req, res) {
        const trends = await (0, trend_detector_1.detectTrendingGalaxies)();
        return (0, response_util_1.success)(res, trends);
    },
};
//# sourceMappingURL=analytics.controller.js.map