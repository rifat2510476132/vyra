import { prisma } from '../lib/prisma';

export async function detectTrendingGalaxies() {
  const galaxies = await prisma.interestGalaxy.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const recentPostCount = await prisma.post.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      deletedAt: null,
    },
  });

  return { galaxies, recentPostCount, topics: galaxies.map((g) => g.name) };
}
