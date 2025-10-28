/**
 * Glamora Store Frontend - Configuration Index
 *
 * Central configuration file for common constants and settings
 */

export const APP_CONFIG = {
  name: 'Glamora Store',
  description: 'Your premium fashion destination',
  version: '1.0.0',
} as const;

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 30000,
} as const;

export const AUTH_CONFIG = {
  tokenKey: 'accessToken',
  userKey: 'user',
  rememberMeDays: 30,
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
} as const;

export const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-right' as const,
} as const;
