import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const commentController: {
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=comment.controller.d.ts.map