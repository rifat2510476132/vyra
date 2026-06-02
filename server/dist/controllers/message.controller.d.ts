import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const messageController: {
    conversations(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    messages(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    markRead(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    startDirect(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=message.controller.d.ts.map