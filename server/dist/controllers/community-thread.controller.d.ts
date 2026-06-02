import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const communityThreadController: {
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    vote(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=community-thread.controller.d.ts.map