import { RegisterInput, LoginInput } from '../validators/auth.validator';
export declare class AuthService {
    register(input: RegisterInput): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
            isVerified?: boolean;
            profile: unknown;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(input: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
            isVerified?: boolean;
            profile: unknown;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
            isVerified?: boolean;
            profile: unknown;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        role: string;
        isVerified?: boolean;
        profile: unknown;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    verifyEmail(code: string): Promise<{
        verified: boolean;
    }>;
    verifyPhone(code: string): Promise<{
        verified: boolean;
    }>;
    private buildAuthResponse;
    private sanitizeUser;
    loginWithGoogle(idToken: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            role: string;
            isVerified?: boolean;
            profile: unknown;
        };
        accessToken: string;
        refreshToken: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map