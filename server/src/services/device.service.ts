import { DevicePlatform } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const deviceService = {
  async register(userId: string, token: string, platform?: string) {
    const plat = (platform?.toUpperCase() ?? 'OTHER') as DevicePlatform;
    const safePlatform = Object.values(DevicePlatform).includes(plat)
      ? plat
      : DevicePlatform.OTHER;

    return prisma.pushDevice.upsert({
      where: { token },
      create: { userId, token, platform: safePlatform },
      update: { userId, platform: safePlatform },
    });
  },

  async unregister(userId: string, token: string) {
    await prisma.pushDevice.deleteMany({
      where: { userId, token },
    });
    return { ok: true };
  },
};
