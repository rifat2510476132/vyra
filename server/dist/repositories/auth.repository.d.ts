import { User, Profile } from '@prisma/client';
export type UserWithProfile = User & {
    profile: Profile | null;
};
export declare class AuthRepository {
    findByEmail(email: string): Promise<UserWithProfile | null>;
    findByGoogleId(googleId: string): Promise<UserWithProfile | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<UserWithProfile | null>;
    create(data: {
        email: string;
        username: string;
        passwordHash: string;
        displayName?: string;
    }): Promise<UserWithProfile>;
    createWithGoogle(data: {
        email: string;
        username: string;
        googleId: string;
        displayName: string;
        avatarUrl?: string;
    }): Promise<UserWithProfile>;
    linkGoogleId(userId: string, googleId: string, displayName?: string, avatarUrl?: string): Promise<UserWithProfile>;
    updateLastLogin(userId: string): Promise<void>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map