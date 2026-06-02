"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = exports.PostRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const postInclude = {
    author: {
        select: {
            id: true,
            username: true,
            profile: { select: { displayName: true, avatarUrl: true } },
        },
    },
    _count: { select: { reactions: true, comments: true } },
};
class PostRepository {
    async findById(id) {
        return prisma_1.prisma.post.findFirst({
            where: { id, deletedAt: null },
            include: postInclude,
        });
    }
    async create(data) {
        return prisma_1.prisma.post.create({
            data: {
                authorId: data.authorId,
                content: data.content,
                mediaUrl: data.mediaUrl,
                mediaUrls: data.mediaUrls,
                pollData: data.pollData,
                type: data.type,
                emotionSignature: data.emotionSignature,
                visibility: data.visibility ?? client_1.PostVisibility.PUBLIC,
            },
            include: postInclude,
        });
    }
    async findFeed(params) {
        const where = {
            deletedAt: null,
            visibility: client_1.PostVisibility.PUBLIC,
            ...(params.authorIds?.length ? { authorId: { in: params.authorIds } } : {}),
        };
        return prisma_1.prisma.post.findMany({
            where,
            include: postInclude,
            orderBy: { createdAt: 'desc' },
            skip: params.skip,
            take: params.take,
        });
    }
    async findByAuthor(authorId, skip, take) {
        return prisma_1.prisma.post.findMany({
            where: { authorId, deletedAt: null },
            include: postInclude,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
    }
    async softDelete(id) {
        return prisma_1.prisma.post.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
exports.PostRepository = PostRepository;
exports.postRepository = new PostRepository();
//# sourceMappingURL=post.repository.js.map