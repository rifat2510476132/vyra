export type GoogleProfile = {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
};
export declare function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile>;
//# sourceMappingURL=google.util.d.ts.map