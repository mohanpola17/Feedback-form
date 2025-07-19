import axios from 'axios';
import { getToken, removeToken } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to trigger snackbar from outside React
function showGlobalSnackbar(message, severity = 'info') {
  window.dispatchEvent(new CustomEvent('global-snackbar', { detail: { message, severity } }));
}

// Global response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      removeToken();
      showGlobalSnackbar('Your session has expired. Please log in again.', 'warning');
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api; 