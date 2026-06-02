import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const dreamBoardController: {
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProgress(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=dream-board.controller.d.ts.map