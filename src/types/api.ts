// Base API Response
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Re-export auth types for backward compatibility
export type {
  LoginRequest,
  LoginResponse,
  IntrospectRequest,
  RegisterRequest,
  OtpVerifyRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
  UserResponse,
  AuthState,
} from '@/features/auth/types/auth.types';
