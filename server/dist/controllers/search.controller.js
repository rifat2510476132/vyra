"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.searchController = {
    async search(req, res) {
        const q = String(req.query.q ?? '').trim();
        if (!q)
            return (0, response_util_1.success)(res, { users: [], posts: [], galaxies: [] });
        const [users, posts, galaxies] = await Promise.all([
            prisma_1.prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: q, mode: 'insensitive' } },
                        { profile: { displayName: { contains: q, mode: 'insensitive' } } },
                    ],
                },
                include: { profile: true },
                take: 10,
            }),
            prisma_1.prisma.post.findMany({
                where: {
                    deletedAt: null,
                    content: { contains: q, mode: 'insensitive' },
                },
                take: 10,
            }),
            prisma_1.prisma.interestGalaxy.findMany({
                where: { name: { contains: q, mode: 'insensitive' } },
                take: 10,
            }),
        ]);
        return (0, response_util_1.success)(res, { users, posts, galaxies });
    },
};
//# sourceMappingURL=search.controller.js.map