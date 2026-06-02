import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const socialEnergyController: {
    me(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    leaderboard(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    applyAction(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=social-energy.controller.d.ts.map