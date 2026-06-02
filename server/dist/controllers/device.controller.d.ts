import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const deviceController: {
    status(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    register(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    unregister(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=device.controller.d.ts.map