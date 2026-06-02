import { Response } from 'express';

import { StoryVisibility } from '@prisma/client';

import { AuthRequest } from '../middleware/auth.middleware';

import { prisma } from '../lib/prisma';

import { success, fail } from '../utils/response.util';



export const storyController = {

  async feed(_req: AuthRequest, res: Response) {

    const stories = await prisma.story.findMany({

      where: { expiresAt: { gt: new Date() }, deletedAt: null },

      include: { author: { include: { profile: true } } },

      orderBy: { createdAt: 'desc' },

    });

    return success(res, stories);

  },



  async create(req: AuthRequest, res: Response) {

    const mediaUrl = String(req.body.mediaUrl ?? '');

    if (!mediaUrl) return fail(res, 'mediaUrl required', 400);

    const hours = Number(req.body.durationHours ?? 24);

    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);



    const story = await prisma.story.create({

      data: {

        authorId: req.user!.userId,

        mediaUrl,

        caption: req.body.caption,

        visibility: (req.body.visibility as StoryVisibility) ?? StoryVisibility.PUBLIC,

        expiresAt,

      },

      include: { author: { include: { profile: true } } },

    });

    return success(res, story, 201);

  },

};


