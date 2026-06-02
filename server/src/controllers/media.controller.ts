import { Response } from 'express';

import { AuthRequest } from '../middleware/auth.middleware';

import { mediaService } from '../services/media.service';

import { success, fail } from '../utils/response.util';



export const mediaController = {

  async status(_req: AuthRequest, res: Response) {

    return success(res, { cloudinary: mediaService.isConfigured() });

  },



  async upload(req: AuthRequest, res: Response) {

    const file = req.file;

    if (!file) return fail(res, 'file required', 400);

    try {

      const purpose = req.body.purpose as string | undefined;

      const result = await mediaService.upload(req.user!.userId, file, purpose);

      return success(res, result, 201);

    } catch (e) {

      return fail(res, e instanceof Error ? e.message : 'Upload failed', 400);

    }

  },



  async remove(req: AuthRequest, res: Response) {

    try {

      const result = await mediaService.remove(

        req.user!.userId,

        String(req.params.mediaId)

      );

      return success(res, result);

    } catch (e) {

      return fail(res, e instanceof Error ? e.message : 'Delete failed', 404);

    }

  },



  async uploadAvatar(req: AuthRequest, res: Response) {

    const file = req.file;

    if (!file) return fail(res, 'file required', 400);

    try {

      const { url } = await mediaService.upload(req.user!.userId, file, 'avatar');

      const profile = await mediaService.setAvatar(req.user!.userId, url);

      return success(res, { url, profile }, 201);

    } catch (e) {

      return fail(res, e instanceof Error ? e.message : 'Avatar upload failed', 400);

    }

  },



  async uploadCover(req: AuthRequest, res: Response) {

    const file = req.file;

    if (!file) return fail(res, 'file required', 400);

    try {

      const { url } = await mediaService.upload(req.user!.userId, file, 'cover');

      const profile = await mediaService.setCover(req.user!.userId, url);

      return success(res, { url, profile }, 201);

    } catch (e) {

      return fail(res, e instanceof Error ? e.message : 'Cover upload failed', 400);

    }

  },

};


