import { Server, Socket } from 'socket.io';
export declare function registerNotificationHandlers(_io: Server, socket: Socket & {
    userId: string;
}): void;
export declare function emitNotification(io: Server, userId: string, payload: {
    id: string;
    type: string;
    title: string;
    body: string;
    referenceId?: string;
}): void;
//# sourceMappingURL=notification.handler.d.ts.map