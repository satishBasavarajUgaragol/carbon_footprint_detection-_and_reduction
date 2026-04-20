import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mark network errors for easier detection
    if (!error.response) {
      error.isNetworkError = true;
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || !error.status) {
        error.isNetworkError = true;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
