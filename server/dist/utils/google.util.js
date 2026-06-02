"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = verifyGoogleIdToken;
async function verifyGoogleIdToken(idToken) {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
    const res = await fetch(url);
    if (!res.ok)
        throw new Error('Invalid Google token');
    const data = (await res.json());
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && data.aud && data.aud !== clientId) {
        throw new Error('Google token audience mismatch');
    }
    if (!data.sub || !data.email)
        throw new Error('Incomplete Google profile');
    return {
        sub: data.sub,
        email: data.email,
        name: data.name,
        picture: data.picture,
    };
}
//# sourceMappingURL=google.util.js.map