import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserRoleUpdateRequest,
  PasswordUpdateRequest,
  UsersParams,
} from '../types/user.types';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with search and pagination
    getUsers: builder.query<ApiResponse<PageResponse<User>>, UsersParams>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),

    // Get user by ID
    getUserById: builder.query<ApiResponse<User>, number>({
      query: (userId) => ({ url: `/admin/users/${userId}` }),
      providesTags: ['User'],
    }),

    // Create new user
    createUser: builder.mutation<ApiResponse<User>, UserCreateRequest>({
      query: (data) => ({
        url: '/admin/users',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation<
      ApiResponse<User>,
      { userId: number; data: UserUpdateRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/admin/users/${userId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Delete user (soft delete)
    deleteUser: builder.mutation<ApiResponse<string>, number>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Activate user
    activateUser: builder.mutation<ApiResponse<User>, number>({
      query: (userId) => ({
        url: `/admin/users/${userId}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),

    // Update user roles
    updateUserRoles: builder.mutation<
      ApiResponse<User>,
      { userId: number; data: UserRoleUpdateRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/admin/users/${userId}/roles`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user password
    updateUserPassword: builder.mutation<
      ApiResponse<User>,
      { userId: number; data: PasswordUpdateRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/admin/users/${userId}/password`,
        method: 'PUT',
        data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useUpdateUserRolesMutation,
  useUpdateUserPasswordMutation,
} = userApi;
