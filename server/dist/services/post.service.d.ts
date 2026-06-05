import { PostVisibility } from '@prisma/client';
export declare class PostService {
    getPost(id: string): Promise<{
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
    }>;
    createPost(authorId: string, data: {
        content?: string;
        mediaUrl?: string;
        mediaUrls?: unknown;
        pollData?: unknown;
        type?: import('@prisma/client').PostType;
        emotionSignature?: string;
        visibility?: PostVisibility;
    }): Promise<{
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
    }>;
    deletePost(id: string, authorId: string): Promise<{
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
    }>;
    getUserPosts(authorId: string, page?: number, limit?: number): Promise<({
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
    })[]>;
    create(authorId: string, data: {
        content?: string;
        mediaUrl?: string;
        mediaUrls?: unknown;
        pollData?: unknown;
        type?: import('@prisma/client').PostType;
        emotionSignature?: string;
        visibility?: PostVisibility;
    }): Promise<{
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
    }>;
    getFeed(page?: number, limit?: number): Promise<({
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
    })[]>;
}
export declare const postService: PostService;
//# sourceMappingURL=post.service.d.ts.map