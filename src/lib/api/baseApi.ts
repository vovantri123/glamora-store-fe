import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

/**
 * Base API instance sử dụng RTK Query với axios base query.
 *
 * @description
 * Đây là instance chính của API được sử dụng để inject các endpoints khác.
 * Sử dụng axiosBaseQuery để xử lý các request HTTP.
 *
 * @input
 * - reducerPath: 'api' - Đường dẫn reducer trong store.
 * - baseQuery: axiosBaseQuery() - Base query sử dụng axios.
 * - tagTypes: ['Auth', 'User'] - Các tag types cho cache invalidation.
 * - endpoints: () => ({}) - Chưa có endpoints, sẽ được inject sau.
 *
 * @output
 * Trả về một API instance của RTK Query với các phương thức như injectEndpoints, useQuery, etc.
 *
 * @usage
 * Import và inject endpoints vào baseApi:
 * ```typescript
 * const api = baseApi.injectEndpoints({
 *   endpoints: (builder) => ({
 *     getUsers: builder.query<User[], void>({
 *       query: () => '/users',
 *     }),
 *   }),
 * });
 * export const { useGetUsersQuery } = api;
 * ```
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User'],
  endpoints: () => ({}),
});

/**
 * Hàm reset state của API.
 *
 * @description
 * Reset toàn bộ state của API, bao gồm cache và mutations.
 * Thường dùng khi logout hoặc cần clear data.
 *
 * @input
 * Không có input parameters.
 *
 * @output
 * Không trả về giá trị, chỉ thực hiện reset state.
 *
 * @usage
 * Gọi hàm này khi cần reset API state:
 * ```typescript
 * resetApiState();
 * ```
 */
export const resetApiState = baseApi.util.resetApiState;
