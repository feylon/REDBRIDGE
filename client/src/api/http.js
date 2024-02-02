import axios from 'axios';

export const TOKEN_KEY = 'redbridge.token';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let unauthorizedHandler = null;

export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const isLogin = error.config?.url?.includes('/auth/login');

    if (status === 401 && !isLogin && unauthorizedHandler) {
      unauthorizedHandler();
    }

    const payload = error.response?.data || {};
    const normalized = new Error(
      payload.message ||
        (error.code === 'ECONNABORTED' ? 'Server javob bermadi' : "Server bilan bog'lanib bo'lmadi"),
    );
    normalized.status = status;
    normalized.details = payload.details || [];
    return Promise.reject(normalized);
  },
);

export default http;
