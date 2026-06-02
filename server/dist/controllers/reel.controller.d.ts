import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const reelController: {
    feed(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=reel.controller.d.ts.map