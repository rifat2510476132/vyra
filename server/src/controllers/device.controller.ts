import { Response } from 'express';

import { AuthRequest } from '../middleware/auth.middleware';

import { deviceService } from '../services/device.service';

import { success, fail } from '../utils/response.util';

import { isFirebaseReady } from '../utils/fcm.util';



export const deviceController = {

  async status(_req: AuthRequest, res: Response) {

    return success(res, { fcm: isFirebaseReady() });

  },



  async register(req: AuthRequest, res: Response) {

    const token = String(req.body.token ?? '');

    if (!token) return fail(res, 'token required', 400);

    const device = await deviceService.register(

      req.user!.userId,

      token,

      req.body.platform

    );

    return success(res, device, 201);

  },



  async unregister(req: AuthRequest, res: Response) {

    const token = String(req.body.token ?? '');

    if (!token) return fail(res, 'token required', 400);

    const result = await deviceService.unregister(req.user!.userId, token);

    return success(res, result);

  },

};


