"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFirebase = initFirebase;
exports.isFirebaseReady = isFirebaseReady;
exports.sendPush = sendPush;
exports.sendPushMany = sendPushMany;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
let initialized = false;
function initFirebase() {
    if (initialized || !process.env.FIREBASE_PROJECT_ID)
        return;
    try {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        initialized = true;
    }
    catch {
        console.warn('FCM: Firebase init skipped');
    }
}
function isFirebaseReady() {
    return initialized;
}
async function sendPush(token, title, body, data) {
    if (!initialized || !token)
        return;
    try {
        await firebase_admin_1.default.messaging().send({
            token,
            notification: { title, body },
            data,
        });
    }
    catch (err) {
        console.warn('FCM send failed:', err);
    }
}
async function sendPushMany(tokens, title, body, data) {
    if (!initialized || !tokens.length)
        return;
    const unique = [...new Set(tokens.filter(Boolean))];
    await Promise.allSettled(unique.map((token) => sendPush(token, title, body, data)));
}
//# sourceMappingURL=fcm.util.js.map