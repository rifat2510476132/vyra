"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
const cloudinary_util_1 = require("../utils/cloudinary.util");
const env_1 = require("../config/env");
function mimeToMediaType(mime) {
    if (mime.startsWith('video/'))
        return client_1.MediaType.VIDEO;
    if (mime.startsWith('audio/'))
        return client_1.MediaType.AUDIO;
    if (mime.startsWith('image/'))
        return client_1.MediaType.IMAGE;
    return client_1.MediaType.DOCUMENT;
}
function folderForPurpose(purpose) {
    switch (purpose) {
        case 'avatar':
            return 'vyra/avatars';
        case 'cover':
            return 'vyra/covers';
        case 'chat':
            return 'vyra/chat';
        case 'story':
            return 'vyra/stories';
        default:
            return 'vyra/posts';
    }
}
exports.mediaService = {
    isConfigured() {
        return Boolean(env_1.env.cloudinary.cloudName && env_1.env.cloudinary.apiKey);
    },
    async upload(uploaderId, file, purpose) {
        if (!this.isConfigured()) {
            throw new Error('Cloudinary is not configured on the server');
        }
        const mime = file.mimetype || 'application/octet-stream';
        const resourceType = mime.startsWith('video/') ? 'video' : 'auto';
        const uploaded = await (0, cloudinary_util_1.uploadBufferToCloudinary)(file.buffer, {
            folder: folderForPurpose(purpose),
            resourceType,
            mimeType: mime,
        });
        const media = await prisma_1.prisma.mediaFile.create({
            data: {
                uploaderId,
                type: mimeToMediaType(mime),
                url: uploaded.url,
                publicId: uploaded.publicId,
                mimeType: mime,
                sizeBytes: file.size,
                width: uploaded.width,
                height: uploaded.height,
            },
        });
        return { media, url: uploaded.url, publicId: uploaded.publicId };
    },
    async remove(userId, mediaId) {
        const media = await prisma_1.prisma.mediaFile.findFirst({
            where: { id: mediaId, uploaderId: userId, deletedAt: null },
        });
        if (!media)
            throw new Error('Media not found');
        if (media.publicId) {
            try {
                await (0, cloudinary_util_1.deleteFromCloudinary)(media.publicId);
            }
            catch {
                // ignore cloud delete errors
            }
        }
        await prisma_1.prisma.mediaFile.update({
            where: { id: mediaId },
            data: { deletedAt: new Date() },
        });
        return { ok: true };
    },
    async setAvatar(userId, url) {
        return prisma_1.prisma.profile.update({
            where: { userId },
            data: { avatarUrl: url },
        });
    },
    async setCover(userId, url) {
        return prisma_1.prisma.profile.update({
            where: { userId },
            data: { coverUrl: url },
        });
    },
};
//# sourceMappingURL=media.service.js.map