"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
class UserRepository {
    async findById(id) {
        return prisma_1.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: { profile: true },
        });
    }
    async findByUsername(username) {
        return prisma_1.prisma.user.findFirst({
            where: { username, deletedAt: null },
            include: { profile: true },
        });
    }
    async updateProfile(userId, data) {
        return prisma_1.prisma.profile.upsert({
            where: { userId },
            create: { userId, ...data },
            update: data,
        });
    }
    async search(query, limit = 20) {
        return prisma_1.prisma.user.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { profile: { displayName: { contains: query, mode: 'insensitive' } } },
                ],
            },
            include: { profile: true },
            take: limit,
        });
    }
    async softDelete(userId) {
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), isActive: false },
        });
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
//# sourceMappingURL=user.repository.js.map