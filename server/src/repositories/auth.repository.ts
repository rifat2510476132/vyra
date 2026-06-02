import bcrypt from 'bcryptjs';
import { User, Profile } from '@prisma/client';
import { prisma } from '../lib/prisma';



export type UserWithProfile = User & { profile: Profile | null };



export class AuthRepository {

  async findByEmail(email: string): Promise<UserWithProfile | null> {

    return prisma.user.findFirst({

      where: { email, deletedAt: null },

      include: { profile: true },

    });

  }



  async findByGoogleId(googleId: string): Promise<UserWithProfile | null> {

    return prisma.user.findFirst({

      where: { googleId, deletedAt: null },

      include: { profile: true },

    });

  }



  async findByUsername(username: string): Promise<User | null> {

    return prisma.user.findFirst({

      where: { username, deletedAt: null },

    });

  }



  async findById(id: string): Promise<UserWithProfile | null> {

    return prisma.user.findFirst({

      where: { id, deletedAt: null },

      include: { profile: true },

    });

  }



  async create(data: {

    email: string;

    username: string;

    passwordHash: string;

    displayName?: string;

  }): Promise<UserWithProfile> {

    return prisma.user.create({

      data: {

        email: data.email,

        username: data.username,

        passwordHash: data.passwordHash,

        profile: {

          create: {

            displayName: data.displayName ?? data.username,

          },

        },

      },

      include: { profile: true },

    });

  }



  async createWithGoogle(data: {

    email: string;

    username: string;

    googleId: string;

    displayName: string;

    avatarUrl?: string;

  }): Promise<UserWithProfile> {

    return prisma.user.create({

      data: {

        email: data.email,

        username: data.username,

        googleId: data.googleId,

        passwordHash: await bcrypt.hash(data.googleId, 12),

        isVerified: true,

        profile: {

          create: {

            displayName: data.displayName,

            avatarUrl: data.avatarUrl,

            isVerified: true,

          },

        },

      },

      include: { profile: true },

    });

  }



  async linkGoogleId(

    userId: string,

    googleId: string,

    displayName?: string,

    avatarUrl?: string

  ): Promise<UserWithProfile> {

    return prisma.user.update({

      where: { id: userId },

      data: {

        googleId,

        isVerified: true,

        profile: {

          update: {

            ...(displayName ? { displayName } : {}),

            ...(avatarUrl ? { avatarUrl } : {}),

          },

        },

      },

      include: { profile: true },

    });

  }



  async updateLastLogin(userId: string): Promise<void> {

    await prisma.user.update({

      where: { id: userId },

      data: { lastLoginAt: new Date() },

    });

  }

}



export const authRepository = new AuthRepository();


