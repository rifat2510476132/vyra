export declare class FeedService {
    getFeed(userId: string, page?: number, limit?: number): Promise<{
        posts: ({
            _count: {
                comments: number;
                reactions: number;
            };
            author: {
                username: string;
                id: string;
                profile: {
                    displayName: string | null;
                    avatarUrl: string | null;
                } | null;
            };
        } & {
            type: import("@prisma/client").$Enums.PostType;
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
            visibility: import("@prisma/client").$Enums.PostVisibility;
        })[];
        page: number;
        limit: number;
        hasMore: boolean;
    }>;
}
export declare const feedService: FeedService;
//# sourceMappingURL=feed.service.d.ts.map