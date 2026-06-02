"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worldController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.worldController = {
    async list(_req, res) {
        const worlds = await prisma_1.prisma.vyraWorld.findMany({
            where: { deletedAt: null, isPublic: true },
            orderBy: { memberCount: 'desc' },
        });
        return (0, response_util_1.success)(res, worlds);
    },
    async join(req, res) {
        const worldId = String(req.params.id);
        const member = await prisma_1.prisma.worldMember.upsert({
            where: {
                worldId_userId: { worldId, userId: req.user.userId },
            },
            create: { worldId, userId: req.user.userId },
            update: {},
        });
        await prisma_1.prisma.vyraWorld.update({
            where: { id: worldId },
            data: { memberCount: { increment: 1 } },
        });
        return (0, response_util_1.success)(res, member);
    },
    async detail(req, res) {
        const slug = String(req.params.slug);
        const world = await prisma_1.prisma.vyraWorld.findFirst({
            where: { slug, deletedAt: null },
            include: { members: { take: 20, include: { user: { include: { profile: true } } } } },
        });
        if (!world)
            return (0, response_util_1.fail)(res, 'World not found', 404);
        return (0, response_util_1.success)(res, world);
    },
};
//# sourceMappingURL=world.controller.js.map