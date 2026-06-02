import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const storyController: {
    feed(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=story.controller.d.ts.map