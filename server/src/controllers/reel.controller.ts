import { Response } from 'express';

import { AuthRequest } from '../middleware/auth.middleware';

import { prisma } from '../lib/prisma';

import { success, fail } from '../utils/response.util';



export const reelController = {

  async feed(_req: AuthRequest, res: Response) {

    const reels = await prisma.reel.findMany({

      where: { deletedAt: null },

      include: { author: { include: { profile: true } } },

      orderBy: { createdAt: 'desc' },

      take: 30,

    });

    return success(res, reels);

  },



  async create(req: AuthRequest, res: Response) {

    const videoUrl = String(req.body.videoUrl ?? '');

    if (!videoUrl) return fail(res, 'videoUrl required', 400);

    const reel = await prisma.reel.create({

      data: {

        authorId: req.user!.userId,

        videoUrl,

        thumbnailUrl: req.body.thumbnailUrl,

        caption: req.body.caption,

        duration: req.body.duration,

      },

      include: { author: { include: { profile: true } } },

    });

    return success(res, reel, 201);

  },

};


