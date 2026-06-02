export declare class UserService {
    getProfile(username: string): Promise<{
        email: string;
        username: string;
        id: string;
        phone: string | null;
        googleId: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profile: import(".prisma/client").Profile | null;
    }>;
    updateProfile(userId: string, data: {
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
        coverUrl?: string;
        location?: string;
        website?: string;
        isPrivate?: boolean;
    }): Promise<{
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
    searchUsers(query: string, limit?: number): Promise<{
        email: string;
        username: string;
        id: string;
        phone: string | null;
        googleId: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        profile: import(".prisma/client").Profile | null;
    }[]>;
    deleteAccount(userId: string): Promise<void>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map