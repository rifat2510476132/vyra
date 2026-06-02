import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const notificationController: {
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    markRead(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    markAllRead(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=notification.controller.d.ts.map