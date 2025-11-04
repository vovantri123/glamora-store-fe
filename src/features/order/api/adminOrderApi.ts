import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';
import { Order as BaseOrder, PageResponse, OrderItem } from './orderApi';

// Admin Order type extends base Order with user info
export interface AdminOrder extends BaseOrder {
  userFullName?: string;
  userEmail?: string;
  subtotal?: number;
}

export interface AdminOrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  status?: string;
  paymentStatus?: string; // Add payment status filter
  userId?: number;
  orderCode?: string;
  userEmail?: string;
  userFullName?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
  note?: string;
}

export const adminOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Get all orders with search
    searchOrders: builder.query<
      ApiResponse<PageResponse<AdminOrder>>,
      AdminOrdersParams
    >({
      query: (params) => ({
        url: '/admin/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    // Admin: Get order by ID
    getOrderByIdAdmin: builder.query<ApiResponse<AdminOrder>, number>({
      query: (id) => ({ url: `/admin/orders/${id}` }),
      providesTags: ['Order'],
    }),
    // Admin: Update order status
    updateOrderStatus: builder.mutation<
      ApiResponse<AdminOrder>,
      { orderId: number; data: UpdateOrderStatusRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Order'],
    }),
    // Admin: Delete order (only CANCELED)
    deleteOrder: builder.mutation<ApiResponse<void>, number>({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSearchOrdersQuery,
  useGetOrderByIdAdminQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = adminOrderApi;
