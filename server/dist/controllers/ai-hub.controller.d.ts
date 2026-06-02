import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const aiHubController: {
    manifest(_req: AuthRequest, res: Response): Response<any, Record<string, any>>;
    invoke(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    bundle(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=ai-hub.controller.d.ts.map