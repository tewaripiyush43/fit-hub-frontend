import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../utils/tokenService";
import { store, authActions } from "../store";
import { errorPopUp } from "../helpers/errorPopUp";

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  const performRefresh = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/refreshToken`,
        {},
        { withCredentials: true }
      );
      const token = res.data.accessToken;
      setAccessToken(token);
      return token;
    } catch (err) {
      // If refresh fails, force logout
      store.dispatch(authActions.setUser({}));
      store.dispatch(authActions.logout());
      clearAccessToken();
      throw err;
    } finally {
      refreshPromise = null;
    }
  };

  refreshPromise = performRefresh();
  return refreshPromise;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Async request interceptor to inject tokens and handle startup auto-refresh
api.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();

    // If no token in memory but isLoggedIn is true in localStorage, refresh first
    const isRefreshEndpoint = config.url && config.url.includes("/auth/refreshToken");
    if (!token && localStorage.getItem("isLoggedIn") === "true" && !isRefreshEndpoint) {
      try {
        token = await refreshAccessToken();
      } catch (err) {
        console.error("Auto refresh on startup request failed:", err);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 retries and global 500/network error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Avoid retrying on auth routes like login or register
    const url = originalRequest.url || "";
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refreshToken");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute && localStorage.getItem("isLoggedIn") === "true") {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Global error handler for 5xx and network errors
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message || "Something went wrong";

    if (!status || status >= 500) {
      errorPopUp(message);
    }

    return Promise.reject(error);
  }
);

export default api;
