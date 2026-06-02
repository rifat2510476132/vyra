import { Profile, User } from '@prisma/client';
export type UserWithProfile = User & {
    profile: Profile | null;
};
export declare class UserRepository {
    findById(id: string): Promise<UserWithProfile | null>;
    findByUsername(username: string): Promise<UserWithProfile | null>;
    updateProfile(userId: string, data: Partial<{
        displayName: string;
        bio: string;
        avatarUrl: string;
        coverUrl: string;
        location: string;
        website: string;
        isPrivate: boolean;
    }>): Promise<Profile>;
    search(query: string, limit?: number): Promise<UserWithProfile[]>;
    softDelete(userId: string): Promise<void>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map