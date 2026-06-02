"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendController = void 0;
const prisma_1 = require("../lib/prisma");
const response_util_1 = require("../utils/response.util");
const notification_dispatch_service_1 = require("../services/notification-dispatch.service");
exports.friendController = {
    async sendRequest(req, res) {
        const receiverId = req.body.receiverId;
        const friend = await prisma_1.prisma.friend.create({
            data: { requesterId: req.user.userId, receiverId, status: 'PENDING' },
        });
        const name = await (0, notification_dispatch_service_1.actorLabel)(req.user.userId);
        await (0, notification_dispatch_service_1.notifyUser)({
            userId: receiverId,
            actorId: req.user.userId,
            type: 'FRIEND_REQUEST',
            title: 'New friend request',
            body: `${name} wants to connect`,
            referenceId: friend.id,
        });
        return (0, response_util_1.success)(res, friend, 201);
    },
    async respond(req, res) {
        const { id, status } = req.body;
        if (status === 'ACCEPTED') {
            const row = await prisma_1.prisma.friend.findFirst({
                where: { id, receiverId: req.user.userId },
            });
            const updated = await prisma_1.prisma.friend.updateMany({
                where: { id, receiverId: req.user.userId },
                data: { status: 'ACCEPTED' },
            });
            if (row) {
                const name = await (0, notification_dispatch_service_1.actorLabel)(req.user.userId);
                await (0, notification_dispatch_service_1.notifyUser)({
                    userId: row.requesterId,
                    actorId: req.user.userId,
                    type: 'FRIEND_REQUEST',
                    title: 'Friend request accepted',
                    body: `${name} accepted your request`,
                    referenceId: row.id,
                });
            }
            return (0, response_util_1.success)(res, { updated: updated.count });
        }
        if (status === 'DECLINED') {
            const removed = await prisma_1.prisma.friend.deleteMany({
                where: { id, receiverId: req.user.userId, status: 'PENDING' },
            });
            return (0, response_util_1.success)(res, { removed: removed.count });
        }
        return (0, response_util_1.fail)(res, 'Invalid status');
    },
    async list(req, res) {
        const friends = await prisma_1.prisma.friend.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [
                    { requesterId: req.user.userId },
                    { receiverId: req.user.userId },
                ],
            },
        });
        return (0, response_util_1.success)(res, friends);
    },
};
//# sourceMappingURL=friend.controller.js.map