"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialEnergyController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.socialEnergyController = {
    async me(req, res) {
        const profile = await prisma_1.prisma.profile.findUnique({
            where: { userId: req.user.userId },
        });
        const logs = await prisma_1.prisma.socialEnergyLog.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        return (0, response_util_1.success)(res, { score: profile?.socialEnergyScore ?? 50, logs });
    },
    async leaderboard(_req, res) {
        const top = await prisma_1.prisma.profile.findMany({
            orderBy: { socialEnergyScore: 'desc' },
            take: 20,
            include: { user: { select: { username: true } } },
        });
        return (0, response_util_1.success)(res, top);
    },
    async applyAction(req, res) {
        const action = String(req.body.action ?? 'content_created');
        const delta = Number(req.body.delta ?? 5);
        const profile = await prisma_1.prisma.profile.findUnique({
            where: { userId: req.user.userId },
        });
        const current = profile?.socialEnergyScore ?? 50;
        const newScore = Math.max(0, Math.min(100, current + delta));
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.profile.update({
                where: { userId: req.user.userId },
                data: { socialEnergyScore: newScore },
            }),
            prisma_1.prisma.socialEnergyLog.create({
                data: {
                    userId: req.user.userId,
                    action,
                    delta,
                    newScore,
                },
            }),
        ]);
        return (0, response_util_1.success)(res, { newScore });
    },
};
//# sourceMappingURL=social-energy.controller.js.map