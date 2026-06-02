/** Allow Flutter web dev (random ports like :57439) and listed production URLs. */
export declare function isAllowedOrigin(origin: string | undefined): boolean;
export declare function corsOriginCallback(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void;
export declare function socketCorsOrigin(): string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void) | "*";
//# sourceMappingURL=cors.util.d.ts.map