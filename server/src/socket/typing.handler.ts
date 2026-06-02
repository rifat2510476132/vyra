import { Server, Socket } from 'socket.io';

export function registerTypingHandlers(_io: Server, socket: Socket & { userId: string }) {
  socket.on('typing:start', (conversationId: string) => {
    socket.to(`conversation:${conversationId}`).emit('typing:start', {
      userId: socket.userId,
      conversationId,
    });
  });

  socket.on('typing:stop', (conversationId: string) => {
    socket.to(`conversation:${conversationId}`).emit('typing:stop', {
      userId: socket.userId,
      conversationId,
    });
  });
}
