"use strict";
/** Allow Flutter web dev (random ports like :57439) and listed production URLs. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedOrigin = isAllowedOrigin;
exports.corsOriginCallback = corsOriginCallback;
exports.socketCorsOrigin = socketCorsOrigin;
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;
function listedOrigins() {
    return (process.env.CLIENT_URL ?? '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
}
function isAllowedOrigin(origin) {
    if (!origin)
        return true;
    if (process.env.NODE_ENV !== 'production' && LOCAL_ORIGIN.test(origin)) {
        return true;
    }
    return listedOrigins().includes(origin);
}
function corsOriginCallback(origin, callback) {
    if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
    }
    callback(new Error(`CORS blocked origin: ${origin ?? 'unknown'}`));
}
function socketCorsOrigin() {
    if (process.env.NODE_ENV !== 'production') {
        return (origin, callback) => corsOriginCallback(origin, callback);
    }
    const list = listedOrigins();
    return list.length ? list : '*';
}
//# sourceMappingURL=cors.util.js.map