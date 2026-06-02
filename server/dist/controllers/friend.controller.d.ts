import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const friendController: {
    sendRequest(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    respond(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=friend.controller.d.ts.map