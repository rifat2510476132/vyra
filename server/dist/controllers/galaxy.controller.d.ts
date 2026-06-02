import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const galaxyController: {
    list(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    trending(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=galaxy.controller.d.ts.map