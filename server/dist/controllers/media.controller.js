"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = void 0;
const media_service_1 = require("../services/media.service");
const response_util_1 = require("../utils/response.util");
exports.mediaController = {
    async status(_req, res) {
        return (0, response_util_1.success)(res, { cloudinary: media_service_1.mediaService.isConfigured() });
    },
    async upload(req, res) {
        const file = req.file;
        if (!file)
            return (0, response_util_1.fail)(res, 'file required', 400);
        try {
            const purpose = req.body.purpose;
            const result = await media_service_1.mediaService.upload(req.user.userId, file, purpose);
            return (0, response_util_1.success)(res, result, 201);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Upload failed', 400);
        }
    },
    async remove(req, res) {
        try {
            const result = await media_service_1.mediaService.remove(req.user.userId, String(req.params.mediaId));
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Delete failed', 404);
        }
    },
    async uploadAvatar(req, res) {
        const file = req.file;
        if (!file)
            return (0, response_util_1.fail)(res, 'file required', 400);
        try {
            const { url } = await media_service_1.mediaService.upload(req.user.userId, file, 'avatar');
            const profile = await media_service_1.mediaService.setAvatar(req.user.userId, url);
            return (0, response_util_1.success)(res, { url, profile }, 201);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Avatar upload failed', 400);
        }
    },
    async uploadCover(req, res) {
        const file = req.file;
        if (!file)
            return (0, response_util_1.fail)(res, 'file required', 400);
        try {
            const { url } = await media_service_1.mediaService.upload(req.user.userId, file, 'cover');
            const profile = await media_service_1.mediaService.setCover(req.user.userId, url);
            return (0, response_util_1.success)(res, { url, profile }, 201);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Cover upload failed', 400);
        }
    },
};
//# sourceMappingURL=media.controller.js.map