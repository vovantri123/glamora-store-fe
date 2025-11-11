import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../types/auth.types';

// Helper function to get user from storage
const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr =
    localStorage.getItem('user') || sessionStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  accessToken:
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken')
      : null,
  isAuthenticated:
    typeof window !== 'undefined'
      ? Boolean(
          localStorage.getItem('accessToken') ||
            sessionStorage.getItem('accessToken')
        )
      : false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
        rememberMe?: boolean;
      }>
    ) => {
      const {
        user,
        accessToken,
        refreshToken,
        rememberMe = false,
      } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;

      // Store tokens and user info according to "Remember me"
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
          // Ensure removal from sessionStorage
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', refreshToken);
          sessionStorage.setItem('user', JSON.stringify(user));
          // Ensure removal from localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        } else {
          sessionStorage.setItem('user', JSON.stringify(action.payload));
        }
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      if (typeof window !== 'undefined') {
        if (localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', action.payload);
        } else {
          sessionStorage.setItem('accessToken', action.payload);
        }
      }
    },

    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;

      // Update storage
      if (typeof window !== 'undefined') {
        const storage = localStorage.getItem('accessToken')
          ? localStorage
          : sessionStorage;
        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', refreshToken);
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  logout,
  setLoading,
  setError,
  clearError,
  updateAccessToken,
  updateTokens,
} = authSlice.actions;

export default authSlice.reducer;
