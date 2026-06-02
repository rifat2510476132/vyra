import { prisma } from '../lib/prisma';

export async function getPersonalizedFeed(userId: string, mood?: string, limit = 20) {
  const interests = await prisma.userInterest.findMany({
    where: { userId },
    orderBy: { weight: 'desc' },
    take: 10,
  });
  const interestTerms = interests.map((i: { interest: string; tag: string }) => i.interest || i.tag);

  const posts = await prisma.post.findMany({
    where: {
      deletedAt: null,
      visibility: 'PUBLIC',
      ...(interestTerms.length
        ? {
            OR: interestTerms.map((tag: string) => ({
              content: { contains: tag, mode: 'insensitive' as const },
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
    const fallback = await prisma.post.findMany({
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
