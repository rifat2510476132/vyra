"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
exports.authenticate = authenticate;
exports.optionalAuth = optionalAuth;
const jwt_util_1 = require("../utils/jwt.util");
const response_util_1 = require("../utils/response.util");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
    if (!token) {
        (0, response_util_1.sendUnauthorized)(res, 'Access token required');
        return;
    }
    try {
        req.user = (0, jwt_util_1.verifyAccessToken)(token);
        next();
    }
    catch {
        (0, response_util_1.sendUnauthorized)(res, 'Invalid or expired access token');
    }
}
exports.authMiddleware = authenticate;
function optionalAuth(req, _res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
    if (token) {
        try {
            req.user = (0, jwt_util_1.verifyAccessToken)(token);
        }
        catch {
            // ignore invalid token for optional auth
        }
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map