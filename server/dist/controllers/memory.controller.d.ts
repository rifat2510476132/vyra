import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const memoryController: {
    universe(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    capsule(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=memory.controller.d.ts.map