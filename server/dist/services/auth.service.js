"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_repository_1 = require("../repositories/auth.repository");
const jwt_util_1 = require("../utils/jwt.util");
const google_util_1 = require("../utils/google.util");
const verification_service_1 = require("./verification.service");
const prisma_1 = require("../lib/prisma");
class AuthService {
    async register(input) {
        const existingEmail = await auth_repository_1.authRepository.findByEmail(input.email);
        if (existingEmail)
            throw new Error('Email already registered');
        const existingUsername = await auth_repository_1.authRepository.findByUsername(input.username);
        if (existingUsername)
            throw new Error('Username already taken');
        const passwordHash = await bcryptjs_1.default.hash(input.password, 12);
        const user = await auth_repository_1.authRepository.create({
            email: input.email,
            username: input.username,
            passwordHash,
            displayName: input.displayName,
        });
        await verification_service_1.verificationService.create('EMAIL_VERIFY', {
            userId: user.id,
            email: user.email,
        });
        return this.buildAuthResponse(user);
    }
    async login(input) {
        const user = await auth_repository_1.authRepository.findByEmail(input.email);
        if (!user || !user.isActive)
            throw new Error('Invalid credentials');
        const valid = await bcryptjs_1.default.compare(input.password, user.passwordHash);
        if (!valid)
            throw new Error('Invalid credentials');
        await auth_repository_1.authRepository.updateLastLogin(user.id);
        return this.buildAuthResponse(user);
    }
    async refresh(refreshToken) {
        const payload = (0, jwt_util_1.verifyRefreshToken)(refreshToken);
        const user = await auth_repository_1.authRepository.findById(payload.userId);
        if (!user || !user.isActive)
            throw new Error('User not found');
        return this.buildAuthResponse(user);
    }
    async getMe(userId) {
        const user = await auth_repository_1.authRepository.findById(userId);
        if (!user)
            throw new Error('User not found');
        return this.sanitizeUser(user);
    }
    async forgotPassword(email) {
        const user = await auth_repository_1.authRepository.findByEmail(email);
        if (user) {
            await verification_service_1.verificationService.create('PASSWORD_RESET', {
                userId: user.id,
                email: user.email,
            });
        }
        return { message: 'If the email exists, a reset link was sent.' };
    }
    async resetPassword(token, newPassword) {
        const row = await verification_service_1.verificationService.consume(token, 'PASSWORD_RESET');
        if (!row.userId)
            throw new Error('Invalid token');
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
        await prisma_1.prisma.user.update({
            where: { id: row.userId },
            data: { passwordHash },
        });
        return { ok: true };
    }
    async verifyEmail(code) {
        const row = await verification_service_1.verificationService.consume(code, 'EMAIL_VERIFY');
        if (!row.userId)
            throw new Error('Invalid code');
        await prisma_1.prisma.user.update({
            where: { id: row.userId },
            data: { isVerified: true },
        });
        return { verified: true };
    }
    async verifyPhone(code) {
        const row = await verification_service_1.verificationService.consume(code, 'PHONE_VERIFY');
        if (!row.userId)
            throw new Error('Invalid code');
        return { verified: true };
    }
    buildAuthResponse(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };
        return {
            user: this.sanitizeUser(user),
            accessToken: (0, jwt_util_1.signAccessToken)(payload),
            refreshToken: (0, jwt_util_1.signRefreshToken)(payload),
        };
    }
    sanitizeUser(user) {
        const { passwordHash: _, ...safe } = user;
        return safe;
    }
    async loginWithGoogle(idToken) {
        if (!idToken)
            throw new Error('idToken required');
        const profile = await (0, google_util_1.verifyGoogleIdToken)(idToken);
        let user = await auth_repository_1.authRepository.findByGoogleId(profile.sub);
        if (!user) {
            const byEmail = await auth_repository_1.authRepository.findByEmail(profile.email);
            if (byEmail) {
                user = await auth_repository_1.authRepository.linkGoogleId(byEmail.id, profile.sub, profile.name, profile.picture);
            }
            else {
                const username = `vyra_${profile.sub.slice(0, 8)}`;
                user = await auth_repository_1.authRepository.createWithGoogle({
                    email: profile.email,
                    username,
                    googleId: profile.sub,
                    displayName: profile.name ?? 'Vyra Traveler',
                    avatarUrl: profile.picture,
                });
            }
        }
        await auth_repository_1.authRepository.updateLastLogin(user.id);
        return this.buildAuthResponse(user);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map