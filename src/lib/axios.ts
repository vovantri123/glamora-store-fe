import axios from 'axios';

import { toast } from 'sonner';
import { logout } from '@/features/auth/store/authSlice';
import { resetApiState } from './api/baseApi';

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

/*
- failedQueue: Queue for failed requests (401) to retry 
after refreshing access token.
- processQueue: Function to process the queue: resolve with new access token 
or reject on error.
*/
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, accessToken: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(accessToken!);
    }
  });

  failedQueue = [];
};

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

// Response interceptor to handle 401 and auto refresh, 403, and network errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config; // Original request that failed
    const now = Date.now();

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true; // Mark request as retried
      isRefreshing = true; // Mark refresh token process as started

      try {
        // Get refresh token
        let refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          refreshToken = sessionStorage.getItem('refreshToken');
        }

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token API
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/public/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Save new tokens
        const storage = localStorage.getItem('accessToken')
          ? localStorage
          : sessionStorage;
        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', newRefreshToken);

        // Update Redux store with new token
        if (typeof window !== 'undefined') {
          const { makeStore } = await import('./store');
          const { updateTokens } = await import(
            '@/features/auth/store/authSlice'
          );
          const store = makeStore();
          store.dispatch(
            updateTokens({ accessToken, refreshToken: newRefreshToken })
          );
        }

        // Update authorization header
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');

        // Dispatch logout action
        if (typeof window !== 'undefined') {
          const { makeStore } = await import('./store');
          const store = makeStore();

          store.dispatch(logout());
          store.dispatch(resetApiState());

          toast.error('Your session has expired. Please login again.');

          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - Redirect to forbidden page
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/forbidden';
        return Promise.reject(error);
      }
    }

    // Handle network errors
    if (!error.response) {
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
