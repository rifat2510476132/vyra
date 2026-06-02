"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galaxyController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.galaxyController = {
    async list(_req, res) {
        const galaxies = await prisma_1.prisma.interestGalaxy.findMany({
            orderBy: { trendingScore: 'desc' },
            take: 50,
        });
        return (0, response_util_1.success)(res, galaxies);
    },
    async trending(_req, res) {
        const galaxies = await prisma_1.prisma.interestGalaxy.findMany({
            orderBy: [{ trendingScore: 'desc' }, { memberCount: 'desc' }],
            take: 20,
        });
        return (0, response_util_1.success)(res, galaxies);
    },
};
//# sourceMappingURL=galaxy.controller.js.map