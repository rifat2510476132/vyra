import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const feedController: {
    home(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    following(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    trending(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    explore(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=feed.controller.d.ts.map