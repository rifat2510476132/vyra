import { Profile, User } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type UserWithProfile = User & { profile: Profile | null };

export class UserRepository {
  async findById(id: string): Promise<UserWithProfile | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { profile: true },
    });
  }

  async findByUsername(username: string): Promise<UserWithProfile | null> {
    return prisma.user.findFirst({
      where: { username, deletedAt: null },
      include: { profile: true },
    });
  }

  async updateProfile(
    userId: string,
    data: Partial<{
      displayName: string;
      bio: string;
      avatarUrl: string;
      coverUrl: string;
      location: string;
      website: string;
      isPrivate: boolean;
    }>
  ): Promise<Profile> {
    return prisma.profile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async search(query: string, limit = 20): Promise<UserWithProfile[]> {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { profile: { displayName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: { profile: true },
      take: limit,
    });
  }

  async softDelete(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}

export const userRepository = new UserRepository();
