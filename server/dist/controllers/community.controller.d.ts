import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const communityController: {
    list(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    join(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=community.controller.d.ts.map