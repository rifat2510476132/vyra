import { Server, Socket } from 'socket.io';

export function registerPresenceHandlers(_io: Server, socket: Socket & { userId: string }) {
  socket.on('presence:update', (presence: string) => {
    socket.broadcast.emit('presence:changed', {
      userId: socket.userId,
      presence,
    });
  });
}
