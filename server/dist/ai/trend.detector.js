"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectTrendingGalaxies = detectTrendingGalaxies;
const prisma_1 = require("../lib/prisma");
async function detectTrendingGalaxies() {
    const galaxies = await prisma_1.prisma.interestGalaxy.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    const recentPostCount = await prisma_1.prisma.post.count({
        where: {
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            deletedAt: null,
        },
    });
    return { galaxies, recentPostCount, topics: galaxies.map((g) => g.name) };
}
//# sourceMappingURL=trend.detector.js.map