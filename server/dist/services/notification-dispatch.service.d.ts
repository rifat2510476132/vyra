import { NotificationType, Prisma } from '@prisma/client';
export type NotifyParams = {
    userId: string;
    actorId?: string;
    type: NotificationType;
    title: string;
    body?: string;
    referenceId?: string;
    data?: Prisma.InputJsonValue;
};
export declare function notifyUser(params: NotifyParams): Promise<{
    body: string | null;
    type: import(".prisma/client").$Enums.NotificationType;
    id: string;
    createdAt: Date;
    deletedAt: Date | null;
    userId: string;
    actorId: string | null;
    title: string;
    referenceId: string | null;
    data: Prisma.JsonValue | null;
    isRead: boolean;
}>;
export declare function actorLabel(actorId: string): Promise<string>;
//# sourceMappingURL=notification-dispatch.service.d.ts.map