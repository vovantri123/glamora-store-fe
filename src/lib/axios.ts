import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

let lastNetworkErrorToast = 0;
let lastServerErrorToast = 0;
const TOAST_COOLDOWN = 5000;

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        token = sessionStorage.getItem('accessToken');
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 and 403
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const now = Date.now();

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (!error.response) {
      if (now - lastNetworkErrorToast > TOAST_COOLDOWN) {
        toast.error(
          'Network Error: Unable to connect to the server. Please check your internet connection.'
        );
        lastNetworkErrorToast = now;
      }
    } else if (error.response?.status >= 500) {
      if (now - lastServerErrorToast > TOAST_COOLDOWN) {
        toast.error(
          'Server Error: Something went wrong on our end. Please try again later.'
        );
        lastServerErrorToast = now;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
