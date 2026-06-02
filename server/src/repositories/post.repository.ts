import { Post, PostVisibility, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

const postInclude = {
  author: {
    select: {
      id: true,
      username: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  },
  _count: { select: { reactions: true, comments: true } },
} satisfies Prisma.PostInclude;

export type PostWithAuthor = Prisma.PostGetPayload<{ include: typeof postInclude }>;

export class PostRepository {
  async findById(id: string): Promise<PostWithAuthor | null> {
    return prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: postInclude,
    });
  }

  async create(data: {
    authorId: string;
    content?: string;
    mediaUrl?: string;
    mediaUrls?: unknown;
    pollData?: unknown;
    type?: import('@prisma/client').PostType;
    emotionSignature?: string;
    visibility?: PostVisibility;
  }): Promise<PostWithAuthor> {
    return prisma.post.create({
      data: {
        authorId: data.authorId,
        content: data.content,
        mediaUrl: data.mediaUrl,
        mediaUrls: data.mediaUrls as Prisma.InputJsonValue | undefined,
        pollData: data.pollData as Prisma.InputJsonValue | undefined,
        type: data.type,
        emotionSignature: data.emotionSignature,
        visibility: data.visibility ?? PostVisibility.PUBLIC,
      },
      include: postInclude,
    });
  }

  async findFeed(params: { skip: number; take: number; authorIds?: string[] }): Promise<PostWithAuthor[]> {
    const where: Prisma.PostWhereInput = {
      deletedAt: null,
      visibility: PostVisibility.PUBLIC,
      ...(params.authorIds?.length ? { authorId: { in: params.authorIds } } : {}),
    };
    return prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.take,
    });
  }

  async findByAuthor(authorId: string, skip: number, take: number): Promise<PostWithAuthor[]> {
    return prisma.post.findMany({
      where: { authorId, deletedAt: null },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async softDelete(id: string): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const postRepository = new PostRepository();
