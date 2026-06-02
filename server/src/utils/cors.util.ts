/** Allow Flutter web dev (random ports like :57439) and listed production URLs. */

const LOCAL_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

function listedOrigins(): string[] {
  return (process.env.CLIENT_URL ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (process.env.NODE_ENV !== 'production' && LOCAL_ORIGIN.test(origin)) {
    return true;
  }
  return listedOrigins().includes(origin);
}

export function corsOriginCallback(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }
  callback(new Error(`CORS blocked origin: ${origin ?? 'unknown'}`));
}

export function socketCorsOrigin() {
  if (process.env.NODE_ENV !== 'production') {
    return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) =>
      corsOriginCallback(origin, callback);
  }
  const list = listedOrigins();
  return list.length ? list : '*';
}
