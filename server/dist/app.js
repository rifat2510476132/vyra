"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const v1_1 = __importDefault(require("./routes/v1"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
const cloudinary_util_1 = require("./utils/cloudinary.util");
const fcm_util_1 = require("./utils/fcm.util");
const cors_util_1 = require("./utils/cors.util");
dotenv_1.default.config();
(0, cloudinary_util_1.initCloudinary)();
(0, fcm_util_1.initFirebase)();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: process.env.WEB_ROOT ? false : undefined,
}));
app.use((0, cors_1.default)({
    origin: cors_util_1.corsOriginCallback,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(logger_middleware_1.httpLogger);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(rateLimiter_middleware_1.apiLimiter);
app.use('/api/v1', v1_1.default);
app.get('/api/v1/health', (_req, res) => {
    res.json({ ok: true, service: 'vyra-api', version: '1.0.0' });
});
const webRoot = process.env.WEB_ROOT;
if (webRoot && fs_1.default.existsSync(webRoot)) {
    app.use(express_1.default.static(webRoot));
    app.get(/^(?!\/api\/).*/, (_req, res) => {
        res.sendFile(path_1.default.join(webRoot, 'index.html'));
    });
}
else {
    app.get('/', (_req, res) => {
        res.json({
            name: 'VYRA API',
            tagline: 'The Social Universe of 2125',
            version: '1.0.0',
            hint: 'Set WEB_ROOT to serve Flutter web build',
        });
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map