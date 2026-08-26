import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if present
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle standardized response and errors
axiosClient.interceptors.response.use(
  (response) => {
    // Return standard payload data if present
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired token redirect / refresh)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear token on definitive 401
      localStorage.removeItem('accessToken');
    }

    // Handle 429 Too Many Requests (Rate Limiting)
    if (error.response && error.response.status === 429) {
      alert(error.response.data?.message || 'You have exceeded the maximum number of requests. Please wait a moment and try again.');
    }

    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default axiosClient;

