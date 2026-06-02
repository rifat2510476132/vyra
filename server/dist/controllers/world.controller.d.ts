import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const worldController: {
    list(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    join(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    detail(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=world.controller.d.ts.map