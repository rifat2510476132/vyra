export declare function getPersonalizedFeed(userId: string, mood?: string, limit?: number): Promise<{
    posts: ({
        comments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            authorId: string;
            content: string;
            postId: string;
            parentId: string | null;
        }[];
        reactions: {
            type: import(".prisma/client").$Enums.ReactionType;
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            postId: string;
            userId: string;
        }[];
        author: {
            profile: {
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
            } | null;
        } & {
            email: string;
            username: string;
            id: string;
            phone: string | null;
            passwordHash: string;
            googleId: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isVerified: boolean;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        type: import(".prisma/client").$Enums.PostType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        authorId: string;
        content: string | null;
        mediaUrl: string | null;
        mediaUrls: import("@prisma/client/runtime/library").JsonValue | null;
        pollData: import("@prisma/client/runtime/library").JsonValue | null;
        emotionSignature: string | null;
        visibility: import(".prisma/client").$Enums.PostVisibility;
    })[];
    mood: string;
    interests: string[];
}>;
//# sourceMappingURL=feed.personalizer.d.ts.map