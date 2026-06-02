import { userRepository } from '../repositories/user.repository';

export class UserService {
  async getProfile(username: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      coverUrl?: string;
      location?: string;
      website?: string;
      isPrivate?: boolean;
    }
  ) {
    return userRepository.updateProfile(userId, data);
  }

  async searchUsers(query: string, limit?: number) {
    const users = await userRepository.search(query, limit);
    return users.map(({ passwordHash: _, ...u }) => u);
  }

  async deleteAccount(userId: string) {
    await userRepository.softDelete(userId);
  }
}

export const userService = new UserService();
