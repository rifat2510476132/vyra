"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.communityController = {
    async list(_req, res) {
        const communities = await prisma_1.prisma.community.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { _count: { select: { members: true } } },
        });
        return (0, response_util_1.success)(res, communities);
    },
    async join(req, res) {
        const communityId = String(req.params.id);
        const member = await prisma_1.prisma.communityMember.upsert({
            where: {
                communityId_userId: {
                    communityId,
                    userId: req.user.userId,
                },
            },
            create: {
                communityId,
                userId: req.user.userId,
            },
            update: {},
        });
        return (0, response_util_1.success)(res, member);
    },
};
//# sourceMappingURL=community.controller.js.map