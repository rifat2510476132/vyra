"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTypingHandlers = registerTypingHandlers;
function registerTypingHandlers(_io, socket) {
    socket.on('typing:start', (conversationId) => {
        socket.to(`conversation:${conversationId}`).emit('typing:start', {
            userId: socket.userId,
            conversationId,
        });
    });
    socket.on('typing:stop', (conversationId) => {
        socket.to(`conversation:${conversationId}`).emit('typing:stop', {
            userId: socket.userId,
            conversationId,
        });
    });
}
//# sourceMappingURL=typing.handler.js.map