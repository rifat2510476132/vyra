import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const analyticsController: {
    creator(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    trends(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=analytics.controller.d.ts.map