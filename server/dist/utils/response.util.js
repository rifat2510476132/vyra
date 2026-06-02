"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendError = sendError;
exports.sendUnauthorized = sendUnauthorized;
exports.sendForbidden = sendForbidden;
exports.sendNotFound = sendNotFound;
exports.sendServerError = sendServerError;
exports.success = success;
exports.fail = fail;
function sendSuccess(res, data, message = 'Success', statusCode = 200, meta) {
    const body = { success: true, message, data };
    if (meta)
        body.meta = meta;
    return res.status(statusCode).json(body);
}
function sendCreated(res, data, message = 'Created') {
    return sendSuccess(res, data, message, 201);
}
function sendError(res, message, statusCode = 400, errors) {
    const body = { success: false, message };
    if (errors !== undefined)
        body.errors = errors;
    return res.status(statusCode).json(body);
}
function sendUnauthorized(res, message = 'Unauthorized') {
    return sendError(res, message, 401);
}
function sendForbidden(res, message = 'Forbidden') {
    return sendError(res, message, 403);
}
function sendNotFound(res, message = 'Not found') {
    return sendError(res, message, 404);
}
function sendServerError(res, message = 'Internal server error') {
    return sendError(res, message, 500);
}
/** Controller shorthand — wraps payload in `{ success, data }`. */
function success(res, data, statusCode = 200, message = 'Success') {
    return sendSuccess(res, data, message, statusCode);
}
function fail(res, message, statusCode = 400) {
    return sendError(res, message, statusCode);
}
//# sourceMappingURL=response.util.js.map