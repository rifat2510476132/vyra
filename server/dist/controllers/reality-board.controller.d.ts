import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const realityBoardController: {
    list(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=reality-board.controller.d.ts.map