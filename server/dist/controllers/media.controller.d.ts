import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const mediaController: {
    status(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    upload(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    uploadAvatar(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    uploadCover(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=media.controller.d.ts.map