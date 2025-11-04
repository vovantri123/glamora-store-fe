import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface OrderItem {
  id: number;
  variantId?: number;
  productName: string;
  variantName?: string;
  variantAttributes?: string;
  productImageUrl?: string;
  quantity: number;
  price?: number;
  unitPrice?: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderCode: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentMethodId?: number;
  paymentMethodName?: string; // COD, VNPay, etc.
  subtotal?: number;
  discountAmount?: number;
  distance?: number;
  shippingFee: number;
  totalAmount: number;
  finalAmount?: number;
  shippingAddress?: string;
  shippingAddressDetail?: string;
  recipientName?: string;
  recipientPhone?: string;
  note?: string;
  canceledReason?: string | null;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  createdAt: string;
  updatedAt?: string | null;
  userId?: number;
  userEmail?: string;
  userFullName?: string;
  addressId?: number;
}

export interface OrdersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  status?: string;
  orderCode?: string;
}

export interface OrderItemRequest {
  variantId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  addressId: number;
  paymentMethodId: number; // Payment method chosen by user (1=COD, 2=VNPay)
  note?: string;
  items: OrderItemRequest[];
  voucherId?: number; // Voucher ID if user applied voucher
  discountAmount?: number; // Calculated discount amount from voucher
}

export interface CancelOrderRequest {
  canceledReason?: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<ApiResponse<PageResponse<Order>>, OrdersParams>({
      query: (params) => ({
        url: '/user/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrderById: builder.query<ApiResponse<Order>, number>({
      query: (id) => ({ url: `/user/orders/${id}` }),
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: (data) => ({
        url: '/user/orders',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    confirmOrderReceived: builder.mutation<ApiResponse<Order>, number>({
      query: (orderId) => ({
        url: `/user/orders/${orderId}/confirm-received`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation<
      ApiResponse<Order>,
      { orderId: number; data: CancelOrderRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/user/orders/${orderId}/cancel`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useConfirmOrderReceivedMutation,
  useCancelOrderMutation,
} = orderApi;
