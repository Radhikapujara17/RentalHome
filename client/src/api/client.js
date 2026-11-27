import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Attach Authorization Bearer token if present & prevent 304 caching
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rentnest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Force browser cache-busting on dynamic API data to strictly eliminate 304 Not Modified
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const reqUrl = error.config?.url || '';
    const isAuthAttempt =
      reqUrl.includes('/auth/login') ||
      reqUrl.includes('/auth/register') ||
      reqUrl.includes('/auth/verify-otp') ||
      reqUrl.includes('/auth/demo-login');

    if (error.response && error.response.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('rentnest_token');
      localStorage.removeItem('rentnest_user');
      localStorage.removeItem('rentnest_wishlist_ids');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('rentnest:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
