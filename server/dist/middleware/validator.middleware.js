"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validate = validate;
const response_util_1 = require("../utils/response.util");
function validateBody(schema) {
    return validate(schema, 'body');
}
function validate(schema, part = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[part]);
        if (!result.success) {
            const errors = formatZodErrors(result.error);
            (0, response_util_1.sendError)(res, 'Validation failed', 422, errors);
            return;
        }
        req[part] = result.data;
        next();
    };
}
function formatZodErrors(error) {
    const formatted = {};
    for (const issue of error.issues) {
        const path = issue.path.join('.') || '_root';
        if (!formatted[path])
            formatted[path] = [];
        formatted[path].push(issue.message);
    }
    return formatted;
}
//# sourceMappingURL=validator.middleware.js.map