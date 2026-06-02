import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const reactionController: {
    react(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    emitVibe(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    save(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=reaction.controller.d.ts.map