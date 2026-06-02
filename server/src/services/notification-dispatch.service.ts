import { NotificationType, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendPushMany } from '../utils/fcm.util';
import { emitNotification } from '../socket/notification.handler';
import { getIo } from '../socket/io-holder';

export type NotifyParams = {
  userId: string;
  actorId?: string;
  type: NotificationType;
  title: string;
  body?: string;
  referenceId?: string;
  data?: Prisma.InputJsonValue;
};

export async function notifyUser(params: NotifyParams) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      actorId: params.actorId,
      type: params.type,
      title: params.title,
      body: params.body,
      referenceId: params.referenceId,
      data: params.data,
    },
  });

  const io = getIo();
  if (io) {
    emitNotification(io, params.userId, {
      id: notification.id,
      type: params.type,
      title: params.title,
      body: params.body ?? '',
      referenceId: params.referenceId,
    });
  }

  const devices = await prisma.pushDevice.findMany({
    where: { userId: params.userId },
    select: { token: true },
  });
  if (devices.length) {
    const data: Record<string, string> = {
      type: params.type,
      notificationId: notification.id,
    };
    if (params.referenceId) data.referenceId = params.referenceId;
    await sendPushMany(
      devices.map((d) => d.token),
      params.title,
      params.body ?? '',
      data
    );
  }

  return notification;
}

export async function actorLabel(actorId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: actorId },
    select: { username: true, profile: { select: { displayName: true } } },
  });
  return user?.profile?.displayName ?? user?.username ?? 'Someone';
}
