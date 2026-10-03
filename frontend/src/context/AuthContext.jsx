import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuth, getToken as getStoredToken, setRefreshToken as storeRefreshToken, setToken as storeToken } from "../services/tokenStorage";
import { getTokenRoles, isTokenExpired, parseJwt } from "../utils/jwt";

const AuthContext = createContext({
  token: null,
  user: null,
  roles: [],
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());

  useEffect(() => {
    const syncToken = () => setToken(getStoredToken());
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const login = (newToken, refreshToken) => {
    storeToken(newToken);
    if (refreshToken) {
      storeRefreshToken(refreshToken);
    }
    setToken(newToken);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
  };

  const user = useMemo(() => {
    if (!token || isTokenExpired(token)) return null;
    return parseJwt(token);
  }, [token]);

  const roles = useMemo(() => {
    if (!token || isTokenExpired(token)) return [];
    return getTokenRoles(token);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      roles,
      isAuthenticated: !!token && !isTokenExpired(token),
      login,
      logout,
    }),
    [token, user, roles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
