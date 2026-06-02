import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { success, fail } from '../utils/response.util';
import { verifyRefreshToken, signAccessToken } from '../utils/jwt.util';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return success(res, result, 201);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Registration failed', 400);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return success(res, result);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Login failed', 401);
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const payload = verifyRefreshToken(refreshToken);
      const accessToken = signAccessToken(payload);
      return success(res, { accessToken });
    } catch {
      return fail(res, 'Invalid refresh token', 401);
    }
  },

  async me(req: Request, res: Response) {
    try {
      const userId = (req as { user?: { userId: string } }).user?.userId;
      if (!userId) return fail(res, 'Unauthorized', 401);
      const user = await authService.getMe(userId);
      return success(res, { user });
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Failed', 400);
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await authService.forgotPassword(String(req.body.email ?? ''));
      return success(res, result);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Failed', 400);
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const result = await authService.resetPassword(
        String(req.body.token ?? ''),
        String(req.body.password ?? '')
      );
      return success(res, result);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Failed', 400);
    }
  },

  async verifyEmail(req: Request, res: Response) {
    try {
      const result = await authService.verifyEmail(String(req.body.code ?? req.body.token ?? ''));
      return success(res, result);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Invalid code', 400);
    }
  },

  async verifyPhone(req: Request, res: Response) {
    try {
      const result = await authService.verifyPhone(String(req.body.code ?? ''));
      return success(res, result);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Invalid code', 400);
    }
  },

  async googleLogin(req: Request, res: Response) {
    try {
      const result = await authService.loginWithGoogle(String(req.body.idToken ?? ''));
      return success(res, result);
    } catch (e) {
      return fail(res, e instanceof Error ? e.message : 'Google login failed', 401);
    }
  },
};
