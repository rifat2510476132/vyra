export declare const mediaService: {
    isConfigured(): boolean;
    upload(uploaderId: string, file: Express.Multer.File, purpose?: string): Promise<{
        media: {
            type: import(".prisma/client").$Enums.MediaType;
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            duration: number | null;
            uploaderId: string;
            url: string;
            publicId: string | null;
            mimeType: string | null;
            sizeBytes: number | null;
            width: number | null;
            height: number | null;
        };
        url: string;
        publicId: string;
    }>;
    remove(userId: string, mediaId: string): Promise<{
        ok: boolean;
    }>;
    setAvatar(userId: string, url: string): Promise<{
        displayName: string | null;
        id: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        avatarUrl: string | null;
        socialEnergyScore: number;
        isPrivate: boolean;
        coverUrl: string | null;
        mood: import(".prisma/client").$Enums.UserMood | null;
        bio: string | null;
        smartPresence: import(".prisma/client").$Enums.SmartPresence | null;
        location: string | null;
        website: string | null;
        birthDate: Date | null;
    }>;
    setCover(userId: string, url: string): Promise<{
        displayName: string | null;
        id: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        avatarUrl: string | null;
        socialEnergyScore: number;
        isPrivate: boolean;
        coverUrl: string | null;
        mood: import(".prisma/client").$Enums.UserMood | null;
        bio: string | null;
        smartPresence: import(".prisma/client").$Enums.SmartPresence | null;
        location: string | null;
        website: string | null;
        birthDate: Date | null;
    }>;
};
//# sourceMappingURL=media.service.d.ts.map