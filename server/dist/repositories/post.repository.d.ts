import { Post, PostVisibility, Prisma } from '@prisma/client';
declare const postInclude: {
    author: {
        select: {
            id: true;
            username: true;
            profile: {
                select: {
                    displayName: true;
                    avatarUrl: true;
                };
            };
        };
    };
    _count: {
        select: {
            reactions: true;
            comments: true;
        };
    };
};
export type PostWithAuthor = Prisma.PostGetPayload<{
    include: typeof postInclude;
}>;
export declare class PostRepository {
    findById(id: string): Promise<PostWithAuthor | null>;
    create(data: {
        authorId: string;
        content?: string;
        mediaUrl?: string;
        mediaUrls?: unknown;
        pollData?: unknown;
        type?: import('@prisma/client').PostType;
        emotionSignature?: string;
        visibility?: PostVisibility;
    }): Promise<PostWithAuthor>;
    findFeed(params: {
        skip: number;
        take: number;
        authorIds?: string[];
    }): Promise<PostWithAuthor[]>;
    findByAuthor(authorId: string, skip: number, take: number): Promise<PostWithAuthor[]>;
    softDelete(id: string): Promise<Post>;
}
export declare const postRepository: PostRepository;
export {};
//# sourceMappingURL=post.repository.d.ts.map