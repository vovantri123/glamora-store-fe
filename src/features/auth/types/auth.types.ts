// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface IntrospectRequest {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  gender?: string;
  dob?: string;
  avatar?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// User Types
export interface User {
  id: number;
  fullName: string;
  gender?: string;
  dob?: string;
  email: string;
  avatar?: string;
  roles?: string[];
}

export interface UserResponse {
  id: number;
  fullName: string;
  gender?: string;
  dob?: string;
  email: string;
  avatar?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
