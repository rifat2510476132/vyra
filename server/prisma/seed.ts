import {
  PrismaClient,
  PostVisibility,
  PostType,
  UserRole,
  UserMood,
  SmartPresence,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@vyra.app' },
    update: {},
    create: {
      email: 'alice@vyra.app',
      phone: '+10000000001',
      username: 'alice',
      passwordHash,
      role: UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          displayName: 'Alice Vyra',
          bio: 'Building the social universe of 2125.',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
          socialEnergyScore: 88,
          mood: UserMood.ENERGIZED,
          smartPresence: SmartPresence.CREATING,
          isVerified: true,
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@vyra.app' },
    update: {},
    create: {
      email: 'bob@vyra.app',
      username: 'bob',
      passwordHash,
      isVerified: true,
      profile: {
        create: {
          displayName: 'Bob Explorer',
          bio: 'Interest galaxy navigator.',
          socialEnergyScore: 72,
          mood: UserMood.SOCIAL,
          smartPresence: SmartPresence.EXPLORING,
        },
      },
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'carol@vyra.app' },
    update: {},
    create: {
      email: 'carol@vyra.app',
      username: 'carol',
      passwordHash,
      isVerified: true,
      profile: {
        create: {
          displayName: 'Carol Dreamer',
          bio: 'Dream boards & memory capsules.',
          socialEnergyScore: 65,
          mood: UserMood.CREATIVE,
          smartPresence: SmartPresence.IN_FLOW,
        },
      },
    },
  });

  await prisma.post.createMany({
    data: [
      {
        authorId: alice.id,
        type: PostType.TEXT,
        content: 'Welcome to Vyra — the social universe of 2125.',
        emotionSignature: 'wonder',
        visibility: PostVisibility.PUBLIC,
      },
      {
        authorId: bob.id,
        type: PostType.TEXT,
        content: 'Traveling the Interest Galaxy clusters today.',
        visibility: PostVisibility.PUBLIC,
      },
      {
        authorId: carol.id,
        type: PostType.DREAM_BOARD,
        content: 'New dream board journey mapped by VYRA AI.',
        visibility: PostVisibility.FRIENDS,
      },
    ],
  });

  await prisma.community.upsert({
    where: { slug: 'vyra-tech' },
    update: {},
    create: {
      ownerId: alice.id,
      name: 'Vyra Tech',
      slug: 'vyra-tech',
      category: 'Technology',
      description: 'Builders of the future.',
      isAiCreated: true,
      members: {
        create: [
          { userId: alice.id, role: 'OWNER' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  });

  await prisma.community.upsert({
    where: { slug: 'vyra-creative' },
    update: {},
    create: {
      ownerId: carol.id,
      name: 'Vyra Creative',
      slug: 'vyra-creative',
      category: 'Art',
      description: 'Creators and dreamers.',
      members: { create: [{ userId: carol.id, role: 'OWNER' }] },
    },
  });

  await prisma.interestGalaxy.createMany({
    data: [
      { name: 'Quantum Tech', category: 'Technology', memberCount: 1204, trendingScore: 98.2 },
      { name: 'Nebula Art', category: 'Art', memberCount: 892, trendingScore: 87.5 },
      { name: 'Stellar Music', category: 'Music', memberCount: 654, trendingScore: 76.1 },
      { name: 'Cosmic Science', category: 'Science', memberCount: 1100, trendingScore: 91.0 },
    ],
    skipDuplicates: true,
  });

  await prisma.userInterest.createMany({
    data: [
      { userId: bob.id, interest: 'astronomy', tag: 'astronomy', weight: 0.9 },
      { userId: carol.id, interest: 'art', tag: 'art', weight: 1.0 },
      { userId: alice.id, interest: 'ai', tag: 'ai', weight: 0.95 },
    ],
    skipDuplicates: true,
  });

  await prisma.dreamBoard.create({
    data: {
      userId: carol.id,
      title: 'Launch Vyra Worlds',
      goalText: 'Build micro-metaverse spaces for every community.',
      progress: 0.35,
      aiJourneyJson: { phases: ['ideate', 'prototype', 'launch'] },
    },
  });

  await prisma.vyraWorld.upsert({
    where: { slug: 'nebula-prime' },
    update: {},
    create: {
      slug: 'nebula-prime',
      name: 'Nebula Prime',
      description: 'The flagship Vyra World — orbital social space of 2125.',
      themeColor: '#7B61FF',
      memberCount: 3,
      coverUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800',
    },
  });

  await prisma.vyraWorld.upsert({
    where: { slug: 'quantum-garden' },
    update: {},
    create: {
      slug: 'quantum-garden',
      name: 'Quantum Garden',
      description: 'Creative minds cultivate reality boards together.',
      themeColor: '#00E5C3',
      memberCount: 2,
    },
  });

  await prisma.realityBoard.create({
    data: {
      userId: alice.id,
      title: '2125 Creator Reality',
      visionText: 'Ship the social universe where AI amplifies human connection.',
      pillarsJson: ['Build', 'Connect', 'Transcend'],
      isPublic: true,
    },
  });

  console.log('Vyra seed complete:', { users: ['alice', 'bob', 'carol'] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
