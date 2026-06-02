"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
exports.deviceService = {
    async register(userId, token, platform) {
        const plat = (platform?.toUpperCase() ?? 'OTHER');
        const safePlatform = Object.values(client_1.DevicePlatform).includes(plat)
            ? plat
            : client_1.DevicePlatform.OTHER;
        return prisma_1.prisma.pushDevice.upsert({
            where: { token },
            create: { userId, token, platform: safePlatform },
            update: { userId, platform: safePlatform },
        });
    },
    async unregister(userId, token) {
        await prisma_1.prisma.pushDevice.deleteMany({
            where: { userId, token },
        });
        return { ok: true };
    },
};
//# sourceMappingURL=device.service.js.map