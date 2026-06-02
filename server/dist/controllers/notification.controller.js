"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
exports.notificationController = {
    async list(req, res) {
        const items = await prisma_1.prisma.notification.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return (0, response_util_1.success)(res, items);
    },
    async markRead(req, res) {
        await prisma_1.prisma.notification.updateMany({
            where: { id: String(req.params.id), userId: req.user.userId },
            data: { isRead: true },
        });
        return (0, response_util_1.success)(res, { ok: true });
    },
    async markAllRead(req, res) {
        await prisma_1.prisma.notification.updateMany({
            where: { userId: req.user.userId, isRead: false },
            data: { isRead: true },
        });
        return (0, response_util_1.success)(res, { ok: true });
    },
};
//# sourceMappingURL=notification.controller.js.map