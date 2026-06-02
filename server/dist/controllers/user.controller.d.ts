import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const userController: {
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    setMood(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    setPresence(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=user.controller.d.ts.map