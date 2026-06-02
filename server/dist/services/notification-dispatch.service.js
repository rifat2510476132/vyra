"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = notifyUser;
exports.actorLabel = actorLabel;
const prisma_1 = require("../lib/prisma");
const fcm_util_1 = require("../utils/fcm.util");
const notification_handler_1 = require("../socket/notification.handler");
const io_holder_1 = require("../socket/io-holder");
async function notifyUser(params) {
    const notification = await prisma_1.prisma.notification.create({
        data: {
            userId: params.userId,
            actorId: params.actorId,
            type: params.type,
            title: params.title,
            body: params.body,
            referenceId: params.referenceId,
            data: params.data,
        },
    });
    const io = (0, io_holder_1.getIo)();
    if (io) {
        (0, notification_handler_1.emitNotification)(io, params.userId, {
            id: notification.id,
            type: params.type,
            title: params.title,
            body: params.body ?? '',
            referenceId: params.referenceId,
        });
    }
    const devices = await prisma_1.prisma.pushDevice.findMany({
        where: { userId: params.userId },
        select: { token: true },
    });
    if (devices.length) {
        const data = {
            type: params.type,
            notificationId: notification.id,
        };
        if (params.referenceId)
            data.referenceId = params.referenceId;
        await (0, fcm_util_1.sendPushMany)(devices.map((d) => d.token), params.title, params.body ?? '', data);
    }
    return notification;
}
async function actorLabel(actorId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: actorId },
        select: { username: true, profile: { select: { displayName: true } } },
    });
    return user?.profile?.displayName ?? user?.username ?? 'Someone';
}
//# sourceMappingURL=notification-dispatch.service.js.map