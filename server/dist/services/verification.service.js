"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const email_util_1 = require("../utils/email.util");
const TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour
exports.verificationService = {
    async create(type, opts) {
        const token = crypto_1.default.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
        const row = await prisma_1.prisma.verificationToken.create({
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
            const link = type === 'PASSWORD_RESET'
                ? `${appUrl}/reset?token=${token}`
                : `${appUrl}/verify?code=${token}`;
            await (0, email_util_1.sendEmail)(opts.email, type === 'PASSWORD_RESET' ? 'Reset your VYRA password' : 'Verify your VYRA email', `Your code: ${token}\n\nOr open: ${link}`);
        }
        return row;
    },
    async consume(token, type) {
        const row = await prisma_1.prisma.verificationToken.findFirst({
            where: { token, type, usedAt: null, expiresAt: { gt: new Date() } },
        });
        if (!row)
            throw new Error('Invalid or expired token');
        await prisma_1.prisma.verificationToken.update({
            where: { id: row.id },
            data: { usedAt: new Date() },
        });
        return row;
    },
};
//# sourceMappingURL=verification.service.js.map