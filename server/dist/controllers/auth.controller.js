"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_util_1 = require("../utils/response.util");
const jwt_util_1 = require("../utils/jwt.util");
exports.authController = {
    async register(req, res) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            return (0, response_util_1.success)(res, result, 201);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Registration failed', 400);
        }
    },
    async login(req, res) {
        try {
            const result = await auth_service_1.authService.login(req.body);
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Login failed', 401);
        }
    },
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            const payload = (0, jwt_util_1.verifyRefreshToken)(refreshToken);
            const accessToken = (0, jwt_util_1.signAccessToken)(payload);
            return (0, response_util_1.success)(res, { accessToken });
        }
        catch {
            return (0, response_util_1.fail)(res, 'Invalid refresh token', 401);
        }
    },
    async me(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return (0, response_util_1.fail)(res, 'Unauthorized', 401);
            const user = await auth_service_1.authService.getMe(userId);
            return (0, response_util_1.success)(res, { user });
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Failed', 400);
        }
    },
    async forgotPassword(req, res) {
        try {
            const result = await auth_service_1.authService.forgotPassword(String(req.body.email ?? ''));
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Failed', 400);
        }
    },
    async resetPassword(req, res) {
        try {
            const result = await auth_service_1.authService.resetPassword(String(req.body.token ?? ''), String(req.body.password ?? ''));
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Failed', 400);
        }
    },
    async verifyEmail(req, res) {
        try {
            const result = await auth_service_1.authService.verifyEmail(String(req.body.code ?? req.body.token ?? ''));
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Invalid code', 400);
        }
    },
    async verifyPhone(req, res) {
        try {
            const result = await auth_service_1.authService.verifyPhone(String(req.body.code ?? ''));
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Invalid code', 400);
        }
    },
    async googleLogin(req, res) {
        try {
            const result = await auth_service_1.authService.loginWithGoogle(String(req.body.idToken ?? ''));
            return (0, response_util_1.success)(res, result);
        }
        catch (e) {
            return (0, response_util_1.fail)(res, e instanceof Error ? e.message : 'Google login failed', 401);
        }
    },
};
//# sourceMappingURL=auth.controller.js.map