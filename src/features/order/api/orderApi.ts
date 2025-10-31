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
  productVariantId: number;
  productName: string;
  variantAttributes: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderCode: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPING'
    | 'COMPLETED'
    | 'CANCELLED';
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  note?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
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
    getOrderByCode: builder.query<ApiResponse<Order>, string>({
      query: (code) => ({ url: `/user/orders/code/${code}` }),
      providesTags: ['Order'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByCodeQuery,
} = orderApi;
