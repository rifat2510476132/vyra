"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPresenceHandlers = registerPresenceHandlers;
function registerPresenceHandlers(_io, socket) {
    socket.on('presence:update', (presence) => {
        socket.broadcast.emit('presence:changed', {
            userId: socket.userId,
            presence,
        });
    });
}
//# sourceMappingURL=presence.handler.js.map