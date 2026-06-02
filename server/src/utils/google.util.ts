export type GoogleProfile = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Invalid Google token');

  const data = (await res.json()) as {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    aud?: string;
  };

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId && data.aud && data.aud !== clientId) {
    throw new Error('Google token audience mismatch');
  }

  if (!data.sub || !data.email) throw new Error('Incomplete Google profile');
  return {
    sub: data.sub,
    email: data.email,
    name: data.name,
    picture: data.picture,
  };
}
