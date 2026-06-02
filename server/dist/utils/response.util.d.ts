import { Response } from 'express';
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: unknown;
    meta?: Record<string, unknown>;
}
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: Record<string, unknown>): Response;
export declare function sendCreated<T>(res: Response, data: T, message?: string): Response;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: unknown): Response;
export declare function sendUnauthorized(res: Response, message?: string): Response;
export declare function sendForbidden(res: Response, message?: string): Response;
export declare function sendNotFound(res: Response, message?: string): Response;
export declare function sendServerError(res: Response, message?: string): Response;
/** Controller shorthand — wraps payload in `{ success, data }`. */
export declare function success<T>(res: Response, data: T, statusCode?: number, message?: string): Response;
export declare function fail(res: Response, message: string, statusCode?: number): Response;
//# sourceMappingURL=response.util.d.ts.map