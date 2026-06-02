"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const post_service_1 = require("../services/post.service");
const response_util_1 = require("../utils/response.util");
exports.postController = {
    async create(req, res) {
        try {
            const post = await post_service_1.postService.create(req.user.userId, req.body);
            return (0, response_util_1.success)(res, post, 201);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Failed to create post', 400);
        }
    },
    async feed(req, res) {
        const page = parseInt(String(req.query.page ?? '0'), 10);
        const limit = parseInt(String(req.query.limit ?? '20'), 10);
        const posts = await post_service_1.postService.getFeed(page, limit);
        return (0, response_util_1.success)(res, posts);
    },
};
//# sourceMappingURL=post.controller.js.map