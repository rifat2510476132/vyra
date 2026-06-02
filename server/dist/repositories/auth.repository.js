"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
class AuthRepository {
    async findByEmail(email) {
        return prisma_1.prisma.user.findFirst({
            where: { email, deletedAt: null },
            include: { profile: true },
        });
    }
    async findByGoogleId(googleId) {
        return prisma_1.prisma.user.findFirst({
            where: { googleId, deletedAt: null },
            include: { profile: true },
        });
    }
    async findByUsername(username) {
        return prisma_1.prisma.user.findFirst({
            where: { username, deletedAt: null },
        });
    }
    async findById(id) {
        return prisma_1.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: { profile: true },
        });
    }
    async create(data) {
        return prisma_1.prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                passwordHash: data.passwordHash,
                profile: {
                    create: {
                        displayName: data.displayName ?? data.username,
                    },
                },
            },
            include: { profile: true },
        });
    }
    async createWithGoogle(data) {
        return prisma_1.prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                googleId: data.googleId,
                passwordHash: await bcryptjs_1.default.hash(data.googleId, 12),
                isVerified: true,
                profile: {
                    create: {
                        displayName: data.displayName,
                        avatarUrl: data.avatarUrl,
                        isVerified: true,
                    },
                },
            },
            include: { profile: true },
        });
    }
    async linkGoogleId(userId, googleId, displayName, avatarUrl) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                googleId,
                isVerified: true,
                profile: {
                    update: {
                        ...(displayName ? { displayName } : {}),
                        ...(avatarUrl ? { avatarUrl } : {}),
                    },
                },
            },
            include: { profile: true },
        });
    }
    async updateLastLogin(userId) {
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { lastLoginAt: new Date() },
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
//# sourceMappingURL=auth.repository.js.map