"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reelController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.reelController = {
    async feed(_req, res) {
        const reels = await prisma_1.prisma.reel.findMany({
            where: { deletedAt: null },
            include: { author: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        return (0, response_util_1.success)(res, reels);
    },
    async create(req, res) {
        const videoUrl = String(req.body.videoUrl ?? '');
        if (!videoUrl)
            return (0, response_util_1.fail)(res, 'videoUrl required', 400);
        const reel = await prisma_1.prisma.reel.create({
            data: {
                authorId: req.user.userId,
                videoUrl,
                thumbnailUrl: req.body.thumbnailUrl,
                caption: req.body.caption,
                duration: req.body.duration,
            },
            include: { author: { include: { profile: true } } },
        });
        return (0, response_util_1.success)(res, reel, 201);
    },
};
//# sourceMappingURL=reel.controller.js.map