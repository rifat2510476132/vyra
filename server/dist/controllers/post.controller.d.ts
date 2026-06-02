import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const postController: {
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    feed(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=post.controller.d.ts.map