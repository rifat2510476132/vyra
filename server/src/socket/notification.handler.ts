import { Server, Socket } from 'socket.io';

export function registerNotificationHandlers(
  _io: Server,
  socket: Socket & { userId: string }
) {
  socket.on('notification:subscribe', () => {
    socket.join(`notifications:${socket.userId}`);
  });
}

export function emitNotification(
  io: Server,
  userId: string,
  payload: {
    id: string;
    type: string;
    title: string;
    body: string;
    referenceId?: string;
  }
) {
  io.to(`user:${userId}`).emit('notification:new', payload);
}
