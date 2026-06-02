import { prisma } from '../lib/prisma';
import { postRepository } from '../repositories/post.repository';

export class FeedService {
  async getFeed(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const following = await prisma.follower.findMany({
      where: { followerId: userId, deletedAt: null },
      select: { followingId: true },
    });

    const friendRows = await prisma.friend.findMany({
      where: {
        deletedAt: null,
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
    });

    const friendIds = friendRows.map((f) =>
      f.requesterId === userId ? f.receiverId : f.requesterId
    );

    const authorIds = [
      userId,
      ...following.map((f) => f.followingId),
      ...friendIds,
    ];

    const posts = await postRepository.findFeed({ skip, take: limit, authorIds });
    return { posts, page, limit, hasMore: posts.length === limit };
  }
}

export const feedService = new FeedService();
