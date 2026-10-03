export const parseJwt = (token) => {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const json = decodeURIComponent(
      payload
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;

  return Math.floor(Date.now() / 1000) >= payload.exp;
};

const normalizeRoleClaim = (claim) => {
  if (!claim) return [];
  if (Array.isArray(claim)) return claim;
  return [claim];
};

export const getTokenRoles = (token) => {
  const payload = parseJwt(token);
  if (!payload) return [];

  const claimKeys = [
    "role",
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"
  ];

  for (const key of claimKeys) {
    if (payload[key]) {
      return normalizeRoleClaim(payload[key]);
    }
  }

  return [];
};
