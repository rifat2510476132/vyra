import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/jwt.util';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): void;
export declare const authMiddleware: typeof authenticate;
export declare function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map