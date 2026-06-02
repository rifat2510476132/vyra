"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
const socket_io_1 = require("socket.io");
const jwt_util_1 = require("../utils/jwt.util");
const chat_handler_1 = require("./chat.handler");
const notification_handler_1 = require("./notification.handler");
const presence_handler_1 = require("./presence.handler");
const typing_handler_1 = require("./typing.handler");
const cors_util_1 = require("../utils/cors.util");
function createSocketServer(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: (0, cors_util_1.socketCorsOrigin)(),
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error('Unauthorized'));
        try {
            const user = (0, jwt_util_1.verifyAccessToken)(token);
            socket.userId = user.userId;
            next();
        }
        catch {
            next(new Error('Unauthorized'));
        }
    });
    io.on('connection', (socket) => {
        const authed = socket;
        authed.join(`user:${authed.userId}`);
        (0, chat_handler_1.registerChatHandlers)(io, authed);
        (0, notification_handler_1.registerNotificationHandlers)(io, authed);
        (0, presence_handler_1.registerPresenceHandlers)(io, authed);
        (0, typing_handler_1.registerTypingHandlers)(io, authed);
    });
    return io;
}
//# sourceMappingURL=socket.server.js.map