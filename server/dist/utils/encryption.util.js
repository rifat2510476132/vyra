"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashText = hashText;
exports.encryptText = encryptText;
const crypto_1 = __importDefault(require("crypto"));
const algorithm = 'aes-256-gcm';
function hashText(text) {
    return crypto_1.default.createHash('sha256').update(text).digest('hex');
}
function encryptText(text, key) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(algorithm, crypto_1.default.scryptSync(key, 'vyra-salt', 32), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}
//# sourceMappingURL=encryption.util.js.map