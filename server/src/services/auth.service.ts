import bcrypt from 'bcryptjs';

import { authRepository } from '../repositories/auth.repository';

import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../utils/jwt.util';

import { RegisterInput, LoginInput } from '../validators/auth.validator';

import { verifyGoogleIdToken } from '../utils/google.util';

import { verificationService } from './verification.service';

import { prisma } from '../lib/prisma';



export class AuthService {

  async register(input: RegisterInput) {

    const existingEmail = await authRepository.findByEmail(input.email);

    if (existingEmail) throw new Error('Email already registered');



    const existingUsername = await authRepository.findByUsername(input.username);

    if (existingUsername) throw new Error('Username already taken');



    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await authRepository.create({

      email: input.email,

      username: input.username,

      passwordHash,

      displayName: input.displayName,

    });



    await verificationService.create('EMAIL_VERIFY', {

      userId: user.id,

      email: user.email,

    });



    return this.buildAuthResponse(user);

  }



  async login(input: LoginInput) {

    const user = await authRepository.findByEmail(input.email);

    if (!user || !user.isActive) throw new Error('Invalid credentials');



    const valid = await bcrypt.compare(input.password, user.passwordHash);

    if (!valid) throw new Error('Invalid credentials');



    await authRepository.updateLastLogin(user.id);

    return this.buildAuthResponse(user);

  }



  async refresh(refreshToken: string) {

    const payload = verifyRefreshToken(refreshToken);

    const user = await authRepository.findById(payload.userId);

    if (!user || !user.isActive) throw new Error('User not found');



    return this.buildAuthResponse(user);

  }



  async getMe(userId: string) {

    const user = await authRepository.findById(userId);

    if (!user) throw new Error('User not found');

    return this.sanitizeUser(user);

  }



  async forgotPassword(email: string) {

    const user = await authRepository.findByEmail(email);

    if (user) {

      await verificationService.create('PASSWORD_RESET', {

        userId: user.id,

        email: user.email,

      });

    }

    return { message: 'If the email exists, a reset link was sent.' };

  }



  async resetPassword(token: string, newPassword: string) {

    const row = await verificationService.consume(token, 'PASSWORD_RESET');

    if (!row.userId) throw new Error('Invalid token');

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({

      where: { id: row.userId },

      data: { passwordHash },

    });

    return { ok: true };

  }



  async verifyEmail(code: string) {

    const row = await verificationService.consume(code, 'EMAIL_VERIFY');

    if (!row.userId) throw new Error('Invalid code');

    await prisma.user.update({

      where: { id: row.userId },

      data: { isVerified: true },

    });

    return { verified: true };

  }



  async verifyPhone(code: string) {

    const row = await verificationService.consume(code, 'PHONE_VERIFY');

    if (!row.userId) throw new Error('Invalid code');

    return { verified: true };

  }



  private buildAuthResponse(user: { id: string; email: string; username: string; role: string; profile: unknown }) {

    const payload: JwtPayload = {

      userId: user.id,

      email: user.email,

      username: user.username,

      role: user.role,

    };

    return {

      user: this.sanitizeUser(user),

      accessToken: signAccessToken(payload),

      refreshToken: signRefreshToken(payload),

    };

  }



  private sanitizeUser(user: { id: string; email: string; username: string; role: string; isVerified?: boolean; profile: unknown; passwordHash?: string }) {

    const { passwordHash: _, ...safe } = user as typeof user & { passwordHash?: string };

    return safe;

  }



  async loginWithGoogle(idToken: string) {

    if (!idToken) throw new Error('idToken required');

    const profile = await verifyGoogleIdToken(idToken);



    let user = await authRepository.findByGoogleId(profile.sub);

    if (!user) {

      const byEmail = await authRepository.findByEmail(profile.email);

      if (byEmail) {

        user = await authRepository.linkGoogleId(byEmail.id, profile.sub, profile.name, profile.picture);

      } else {

        const username = `vyra_${profile.sub.slice(0, 8)}`;

        user = await authRepository.createWithGoogle({

          email: profile.email,

          username,

          googleId: profile.sub,

          displayName: profile.name ?? 'Vyra Traveler',

          avatarUrl: profile.picture,

        });

      }

    }



    await authRepository.updateLastLogin(user.id);

    return this.buildAuthResponse(user);

  }

}



export const authService = new AuthService();


