import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../utils/email.util';

const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

export const verificationService = {
  async create(type: string, opts: { userId?: string; email?: string; phone?: string }) {
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    const row = await prisma.verificationToken.create({
      data: {
        type,
        token,
        expiresAt,
        userId: opts.userId,
        email: opts.email,
        phone: opts.phone,
      },
    });
    const target = opts.email ?? opts.phone;
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[VYRA] ${type} token for ${target ?? opts.userId}: ${token}`);
    }
    if (opts.email && (type === 'EMAIL_VERIFY' || type === 'PASSWORD_RESET')) {
      const appUrl = process.env.APP_PUBLIC_URL ?? 'http://localhost:5000';
      const link =
        type === 'PASSWORD_RESET'
          ? `${appUrl}/reset?token=${token}`
          : `${appUrl}/verify?code=${token}`;
      await sendEmail(
        opts.email,
        type === 'PASSWORD_RESET' ? 'Reset your VYRA password' : 'Verify your VYRA email',
        `Your code: ${token}\n\nOr open: ${link}`
      );
    }
    return row;
  },

  async consume(token: string, type: string) {
    const row = await prisma.verificationToken.findFirst({
      where: { token, type, usedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!row) throw new Error('Invalid or expired token');
    await prisma.verificationToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    });
    return row;
  },
};
