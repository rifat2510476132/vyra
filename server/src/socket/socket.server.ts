import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.util';
import { registerChatHandlers } from './chat.handler';
import { registerNotificationHandlers } from './notification.handler';
import { registerPresenceHandlers } from './presence.handler';
import { registerTypingHandlers } from './typing.handler';
import { socketCorsOrigin } from '../utils/cors.util';

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: socketCorsOrigin(),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Unauthorized'));
    try {
      const user = verifyAccessToken(token);
      (socket as Socket & { userId: string }).userId = user.userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const authed = socket as Socket & { userId: string };
    authed.join(`user:${authed.userId}`);
    registerChatHandlers(io, authed);
    registerNotificationHandlers(io, authed);
    registerPresenceHandlers(io, authed);
    registerTypingHandlers(io, authed);
  });

  return io;
}
