import { PostVisibility } from '@prisma/client';
import { postRepository } from '../repositories/post.repository';

export class PostService {
  async getPost(id: string) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createPost(
    authorId: string,
    data: {
      content?: string;
      mediaUrl?: string;
      mediaUrls?: unknown;
      pollData?: unknown;
      type?: import('@prisma/client').PostType;
      emotionSignature?: string;
      visibility?: PostVisibility;
    }
  ) {
    if (
      !data.content &&
      !data.mediaUrl &&
      data.mediaUrls == null &&
      data.pollData == null &&
      data.type !== 'POLL'
    ) {
      throw new Error('Post must have content or media');
    }
    return postRepository.create({
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

  async deletePost(id: string, authorId: string) {
    const post = await postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    if (post.authorId !== authorId) throw new Error('Not authorized');
    return postRepository.softDelete(id);
  }

  async getUserPosts(authorId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return postRepository.findByAuthor(authorId, skip, limit);
  }

  async create(
    authorId: string,
    data: {
      content?: string;
      mediaUrl?: string;
      mediaUrls?: unknown;
      pollData?: unknown;
      type?: import('@prisma/client').PostType;
      emotionSignature?: string;
      visibility?: PostVisibility;
    }
  ) {
    return this.createPost(authorId, data);
  }

  async getFeed(page = 0, limit = 20) {
    return postRepository.findFeed({ skip: page * limit, take: limit });
  }
}

export const postService = new PostService();
