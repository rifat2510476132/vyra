export declare const deviceService: {
    register(userId: string, token: string, platform?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        token: string;
        platform: import("@prisma/client").$Enums.DevicePlatform;
    }>;
    unregister(userId: string, token: string): Promise<{
        ok: boolean;
    }>;
};
//# sourceMappingURL=device.service.d.ts.map