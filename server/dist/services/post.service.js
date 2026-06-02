"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const post_repository_1 = require("../repositories/post.repository");
class PostService {
    async getPost(id) {
        const post = await post_repository_1.postRepository.findById(id);
        if (!post)
            throw new Error('Post not found');
        return post;
    }
    async createPost(authorId, data) {
        if (!data.content &&
            !data.mediaUrl &&
            data.mediaUrls == null &&
            data.pollData == null &&
            data.type !== 'POLL') {
            throw new Error('Post must have content or media');
        }
        return post_repository_1.postRepository.create({
            authorId,
            content: data.content,
            mediaUrl: data.mediaUrl,
            mediaUrls: data.mediaUrls,
            pollData: data.pollData,
            type: data.type,
            emotionSignature: data.emotionSignature,
            visibility: data.visibility,
        });
    }
    async deletePost(id, authorId) {
        const post = await post_repository_1.postRepository.findById(id);
        if (!post)
            throw new Error('Post not found');
        if (post.authorId !== authorId)
            throw new Error('Not authorized');
        return post_repository_1.postRepository.softDelete(id);
    }
    async getUserPosts(authorId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return post_repository_1.postRepository.findByAuthor(authorId, skip, limit);
    }
    async create(authorId, data) {
        return this.createPost(authorId, data);
    }
    async getFeed(page = 0, limit = 20) {
        return post_repository_1.postRepository.findFeed({ skip: page * limit, take: limit });
    }
}
exports.PostService = PostService;
exports.postService = new PostService();
//# sourceMappingURL=post.service.js.map