import api from "./api";
import { clearAuth, setRefreshToken, setToken } from "./tokenStorage";

export const register = async (userData) => {
  const response = await api.post(`auth/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post(`auth/login`, userData);

  if (response.data?.accessToken) {
    setToken(response.data.accessToken);
  }

  if (response.data?.refreshToken) {
    setRefreshToken(response.data.refreshToken);
  }

  return response.data;
};

export const logout = () => {
  clearAuth();
};

export default api;