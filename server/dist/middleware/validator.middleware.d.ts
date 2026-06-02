import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type RequestPart = 'body' | 'query' | 'params';
export declare function validateBody(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
export declare function validate(schema: ZodSchema, part?: RequestPart): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validator.middleware.d.ts.map