"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyController = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.storyController = {
    async feed(_req, res) {
        const stories = await prisma_1.prisma.story.findMany({
            where: { expiresAt: { gt: new Date() }, deletedAt: null },
            include: { author: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return (0, response_util_1.success)(res, stories);
    },
    async create(req, res) {
        const mediaUrl = String(req.body.mediaUrl ?? '');
        if (!mediaUrl)
            return (0, response_util_1.fail)(res, 'mediaUrl required', 400);
        const hours = Number(req.body.durationHours ?? 24);
        const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
        const story = await prisma_1.prisma.story.create({
            data: {
                authorId: req.user.userId,
                mediaUrl,
                caption: req.body.caption,
                visibility: req.body.visibility ?? client_1.StoryVisibility.PUBLIC,
                expiresAt,
            },
            include: { author: { include: { profile: true } } },
        });
        return (0, response_util_1.success)(res, story, 201);
    },
};
//# sourceMappingURL=story.controller.js.map