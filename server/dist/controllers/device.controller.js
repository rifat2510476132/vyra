"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceController = void 0;
const device_service_1 = require("../services/device.service");
const response_util_1 = require("../utils/response.util");
const fcm_util_1 = require("../utils/fcm.util");
exports.deviceController = {
    async status(_req, res) {
        return (0, response_util_1.success)(res, { fcm: (0, fcm_util_1.isFirebaseReady)() });
    },
    async register(req, res) {
        const token = String(req.body.token ?? '');
        if (!token)
            return (0, response_util_1.fail)(res, 'token required', 400);
        const device = await device_service_1.deviceService.register(req.user.userId, token, req.body.platform);
        return (0, response_util_1.success)(res, device, 201);
    },
    async unregister(req, res) {
        const token = String(req.body.token ?? '');
        if (!token)
            return (0, response_util_1.fail)(res, 'token required', 400);
        const result = await device_service_1.deviceService.unregister(req.user.userId, token);
        return (0, response_util_1.success)(res, result);
    },
};
//# sourceMappingURL=device.controller.js.map