/** Shared API contracts between Vyra client and server */

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    profile?: { displayName?: string; avatarUrl?: string };
  };
}

export const SOCKET_EVENTS = {
  chatJoin: 'chat:join',
  chatMessage: 'chat:message',
  chatEdited: 'chat:edited',
  chatDeleted: 'chat:deleted',
  typingStart: 'typing:start',
  typingStop: 'typing:stop',
  presenceUpdate: 'presence:update',
  notificationPush: 'notification:push',
} as const;
