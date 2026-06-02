"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalizedFeed = getPersonalizedFeed;
const prisma_1 = require("../lib/prisma");
async function getPersonalizedFeed(userId, mood, limit = 20) {
    const interests = await prisma_1.prisma.userInterest.findMany({
        where: { userId },
        orderBy: { weight: 'desc' },
        take: 10,
    });
    const interestTerms = interests.map((i) => i.interest || i.tag);
    const posts = await prisma_1.prisma.post.findMany({
        where: {
            deletedAt: null,
            visibility: 'PUBLIC',
            ...(interestTerms.length
                ? {
                    OR: interestTerms.map((tag) => ({
                        content: { contains: tag, mode: 'insensitive' },
                    })),
                }
                : {}),
        },
        include: {
            author: { include: { profile: true } },
            reactions: true,
            comments: { take: 3 },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    if (posts.length === 0) {
        const fallback = await prisma_1.prisma.post.findMany({
            where: { deletedAt: null, visibility: 'PUBLIC' },
            include: {
                author: { include: { profile: true } },
                reactions: true,
                comments: { take: 3 },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return { posts: fallback, mood: mood ?? 'SOCIAL', interests: interestTerms };
    }
    return { posts, mood: mood ?? 'SOCIAL', interests: interestTerms };
}
//# sourceMappingURL=feed.personalizer.js.map