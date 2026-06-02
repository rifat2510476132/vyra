import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const groupController: {
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    join(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=group.controller.d.ts.map