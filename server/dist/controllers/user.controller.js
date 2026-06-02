"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.userController = {
    async getProfile(req, res) {
        const username = String(req.params.username);
        const user = await prisma_1.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                isVerified: true,
                createdAt: true,
                profile: true,
                posts: {
                    where: { deletedAt: null },
                    take: 12,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user)
            return (0, response_util_1.fail)(res, 'Profile not found', 404);
        return (0, response_util_1.success)(res, user);
    },
    async updateProfile(req, res) {
        const profile = await prisma_1.prisma.profile.update({
            where: { userId: req.user.userId },
            data: {
                displayName: req.body.displayName,
                bio: req.body.bio,
                avatarUrl: req.body.avatarUrl,
                coverUrl: req.body.coverUrl,
            },
        });
        return (0, response_util_1.success)(res, profile);
    },
    async setMood(req, res) {
        const profile = await prisma_1.prisma.profile.update({
            where: { userId: req.user.userId },
            data: { mood: req.body.mood },
        });
        return (0, response_util_1.success)(res, profile);
    },
    async setPresence(req, res) {
        const profile = await prisma_1.prisma.profile.update({
            where: { userId: req.user.userId },
            data: { smartPresence: req.body.presence },
        });
        return (0, response_util_1.success)(res, profile);
    },
};
//# sourceMappingURL=user.controller.js.map