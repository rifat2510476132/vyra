"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedService = exports.FeedService = void 0;
const prisma_1 = require("../lib/prisma");
const post_repository_1 = require("../repositories/post.repository");
class FeedService {
    async getFeed(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const following = await prisma_1.prisma.follower.findMany({
            where: { followerId: userId, deletedAt: null },
            select: { followingId: true },
        });
        const friendRows = await prisma_1.prisma.friend.findMany({
            where: {
                deletedAt: null,
                status: 'ACCEPTED',
                OR: [{ requesterId: userId }, { receiverId: userId }],
            },
        });
        const friendIds = friendRows.map((f) => f.requesterId === userId ? f.receiverId : f.requesterId);
        const authorIds = [
            userId,
            ...following.map((f) => f.followingId),
            ...friendIds,
        ];
        const posts = await post_repository_1.postRepository.findFeed({ skip, take: limit, authorIds });
        return { posts, page, limit, hasMore: posts.length === limit };
    }
}
exports.FeedService = FeedService;
exports.feedService = new FeedService();
//# sourceMappingURL=feed.service.js.map