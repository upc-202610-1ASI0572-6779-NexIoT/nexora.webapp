import axios from 'axios';

// If VITE_API_URL is not set in your environment, fallback to the
// backend URL used by the dev proxy. Adjust the fallback to match your API.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  // Most endpoints use Bearer token in Authorization header; disable cookies by default to avoid CORS credential issues in dev.
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Debug helper: show where requests are going and whether Authorization is attached
  // Remove or disable in production
  try {
    // eslint-disable-next-line no-console
    console.debug('[apiClient] Request', { url: config.url, baseURL: config.baseURL, hasAuth: !!config.headers.Authorization });
  } catch (e) {}
  return config;
});

// Global response error mapping: if there is no response (network error / CORS / TLS), return a normalized error
apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (!error.response) {
      // Network-level error (CORS, certificate, server down)
      return Promise.reject({ code: 'NETWORK_ERROR', message: 'Unable to connect to the server. Please try again later.' });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
