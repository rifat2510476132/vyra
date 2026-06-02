"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.initCloudinary = initCloudinary;
exports.uploadToCloudinary = uploadToCloudinary;
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const env_1 = require("../config/env");
let configured = false;
function initCloudinary() {
    if (configured || !env_1.env.cloudinary.cloudName)
        return;
    cloudinary_1.v2.config({
        cloud_name: env_1.env.cloudinary.cloudName,
        api_key: env_1.env.cloudinary.apiKey,
        api_secret: env_1.env.cloudinary.apiSecret,
    });
    configured = true;
}
async function uploadToCloudinary(filePath, folder = 'vyra') {
    initCloudinary();
    const result = await cloudinary_1.v2.uploader.upload(filePath, { folder });
    return { url: result.secure_url, publicId: result.public_id };
}
async function uploadBufferToCloudinary(buffer, options = {}) {
    initCloudinary();
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder: options.folder ?? 'vyra',
            resource_type: options.resourceType ?? 'auto',
        }, (err, result) => {
            if (err || !result) {
                reject(err ?? new Error('Cloudinary upload failed'));
                return;
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            });
        });
        stream.end(buffer);
    });
}
async function deleteFromCloudinary(publicId) {
    initCloudinary();
    await cloudinary_1.v2.uploader.destroy(publicId);
}
//# sourceMappingURL=cloudinary.util.js.map