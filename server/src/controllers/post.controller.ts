import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { postService } from '../services/post.service';
import { success, fail } from '../utils/response.util';

export const postController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const post = await postService.create(req.user!.userId, req.body);
      return success(res, post, 201);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Failed to create post', 400);
    }
  },

  async feed(req: AuthRequest, res: Response) {
    const page = parseInt(String(req.query.page ?? '0'), 10);
    const limit = parseInt(String(req.query.limit ?? '20'), 10);
    const posts = await postService.getFeed(page, limit);
    return success(res, posts);
  },
};
