export declare const verificationService: {
    create(type: string, opts: {
        userId?: string;
        email?: string;
        phone?: string;
    }): Promise<{
        email: string | null;
        type: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        userId: string | null;
        expiresAt: Date;
        token: string;
        usedAt: Date | null;
    }>;
    consume(token: string, type: string): Promise<{
        email: string | null;
        type: string;
        id: string;
        phone: string | null;
        createdAt: Date;
        userId: string | null;
        expiresAt: Date;
        token: string;
        usedAt: Date | null;
    }>;
};
//# sourceMappingURL=verification.service.d.ts.map