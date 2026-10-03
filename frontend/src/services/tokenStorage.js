export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};
