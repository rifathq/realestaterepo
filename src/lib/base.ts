// The site can be served under a sub-path (UAT: uat.digents.com/masud). Vite sets
// BASE_URL from APP_BASE at build time; locally it is "/".
export const BASE = ((import.meta as any).env?.BASE_URL || '/').replace(/\/$/, '');

export const withBase = (path: string) => (path.startsWith('/') ? `${BASE}${path}` : path);
