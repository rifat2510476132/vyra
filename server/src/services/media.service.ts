import { MediaType } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from '../utils/cloudinary.util';
import { env } from '../config/env';

function mimeToMediaType(mime: string): MediaType {
  if (mime.startsWith('video/')) return MediaType.VIDEO;
  if (mime.startsWith('audio/')) return MediaType.AUDIO;
  if (mime.startsWith('image/')) return MediaType.IMAGE;
  return MediaType.DOCUMENT;
}

function folderForPurpose(purpose?: string): string {
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

export const mediaService = {
  isConfigured(): boolean {
    return Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey);
  },

  async upload(
    uploaderId: string,
    file: Express.Multer.File,
    purpose?: string
  ) {
    if (!this.isConfigured()) {
      throw new Error('Cloudinary is not configured on the server');
    }

    const mime = file.mimetype || 'application/octet-stream';
    const resourceType = mime.startsWith('video/') ? 'video' : 'auto';
    const uploaded = await uploadBufferToCloudinary(file.buffer, {
      folder: folderForPurpose(purpose),
      resourceType,
      mimeType: mime,
    });

    const media = await prisma.mediaFile.create({
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

  async remove(userId: string, mediaId: string) {
    const media = await prisma.mediaFile.findFirst({
      where: { id: mediaId, uploaderId: userId, deletedAt: null },
    });
    if (!media) throw new Error('Media not found');

    if (media.publicId) {
      try {
        await deleteFromCloudinary(media.publicId);
      } catch {
        // ignore cloud delete errors
      }
    }

    await prisma.mediaFile.update({
      where: { id: mediaId },
      data: { deletedAt: new Date() },
    });
    return { ok: true };
  },

  async setAvatar(userId: string, url: string) {
    return prisma.profile.update({
      where: { userId },
      data: { avatarUrl: url },
    });
  },

  async setCover(userId: string, url: string) {
    return prisma.profile.update({
      where: { userId },
      data: { coverUrl: url },
    });
  },
};
