"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
class UserService {
    async getProfile(username) {
        const user = await user_repository_1.userRepository.findByUsername(username);
        if (!user)
            throw new Error('User not found');
        const { passwordHash: _, ...safe } = user;
        return safe;
    }
    async updateProfile(userId, data) {
        return user_repository_1.userRepository.updateProfile(userId, data);
    }
    async searchUsers(query, limit) {
        const users = await user_repository_1.userRepository.search(query, limit);
        return users.map(({ passwordHash: _, ...u }) => u);
    }
    async deleteAccount(userId) {
        await user_repository_1.userRepository.softDelete(userId);
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map