export declare function initFirebase(): void;
export declare function isFirebaseReady(): boolean;
export declare function sendPush(token: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
export declare function sendPushMany(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<void>;
//# sourceMappingURL=fcm.util.d.ts.map