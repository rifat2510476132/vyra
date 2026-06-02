import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const voiceNebulaController: {
    converse(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    status(_req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=voice-nebula.controller.d.ts.map