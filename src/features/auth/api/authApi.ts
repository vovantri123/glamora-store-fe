import { baseApi } from '@/lib/api/baseApi';
import type { ApiResponse } from '@/types/api.type';
import type {
  LoginRequest,
  LoginResponse,
  IntrospectRequest,
  RegisterRequest,
  UserResponse,
  OtpVerifyRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  UpdatePasswordRequest,
} from '../types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: '/public/auth/login',
        method: 'POST',
        data: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<ApiResponse<UserResponse>, void>({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    introspect: builder.mutation<ApiResponse<void>, IntrospectRequest>({
      query: (data: IntrospectRequest) => ({
        url: '/public/auth/introspect',
        method: 'POST',
        data,
      }),
    }),

    register: builder.mutation<ApiResponse<UserResponse>, RegisterRequest>({
      query: (data: RegisterRequest) => ({
        url: '/public/auth/register',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    verifyRegisterOtp: builder.mutation<ApiResponse<void>, OtpVerifyRequest>({
      query: (data: OtpVerifyRequest) => ({
        url: '/public/auth/verify-register-otp',
        method: 'POST',
        data,
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequest>({
      query: (data: ForgotPasswordRequest) => ({
        url: '/public/auth/forgot-password',
        method: 'POST',
        data,
      }),
    }),

    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequest>({
      query: (data: ResetPasswordRequest) => ({
        url: '/public/auth/reset-password',
        method: 'POST',
        data,
      }),
    }),

    updateProfile: builder.mutation<
      ApiResponse<UserResponse>,
      UpdateProfileRequest
    >({
      query: (data: UpdateProfileRequest) => ({
        url: '/user/profile',
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    updatePassword: builder.mutation<ApiResponse<void>, UpdatePasswordRequest>({
      query: (data: UpdatePasswordRequest) => ({
        url: '/user/profile/password',
        method: 'PUT',
        data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useIntrospectMutation,
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = authApi;
