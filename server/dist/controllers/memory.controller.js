"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.memoryController = {
    async universe(req, res) {
        const memories = await prisma_1.prisma.memoryTimeline.findMany({
            where: { userId: req.user.userId, deletedAt: null },
            orderBy: { occurredAt: 'desc' },
        });
        return (0, response_util_1.success)(res, memories);
    },
    async capsule(req, res) {
        const { title, content, surfaceAt, emotionTag } = req.body;
        if (!title)
            return (0, response_util_1.fail)(res, 'title required');
        const memory = await prisma_1.prisma.memoryTimeline.create({
            data: {
                userId: req.user.userId,
                title: String(title),
                content: content ? String(content) : null,
                emotionTag: emotionTag ? String(emotionTag) : null,
                clusterType: 'capsule',
                surfaceAt: surfaceAt ? new Date(surfaceAt) : null,
                occurredAt: new Date(),
            },
        });
        return (0, response_util_1.success)(res, memory, 201);
    },
};
//# sourceMappingURL=memory.controller.js.map