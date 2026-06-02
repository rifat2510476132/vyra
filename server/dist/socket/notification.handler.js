"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNotificationHandlers = registerNotificationHandlers;
exports.emitNotification = emitNotification;
function registerNotificationHandlers(_io, socket) {
    socket.on('notification:subscribe', () => {
        socket.join(`notifications:${socket.userId}`);
    });
}
function emitNotification(io, userId, payload) {
    io.to(`user:${userId}`).emit('notification:new', payload);
}
//# sourceMappingURL=notification.handler.js.map