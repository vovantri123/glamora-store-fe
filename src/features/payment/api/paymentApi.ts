import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';

export interface CreatePaymentRequest {
  orderId: number;
  paymentMethodId: number;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  orderCode: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  paymentMethod: {
    id: number;
    name: string;
  };
  payUrl?: string; // ✅ Changed from paymentUrl to match backend
  transactionId?: string;
  failedReason?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<
      ApiResponse<PaymentResponse>,
      CreatePaymentRequest
    >({
      query: (data) => ({
        url: '/user/payments',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Order'],
    }),
    getPaymentByOrderId: builder.query<ApiResponse<PaymentResponse>, number>({
      query: (orderId) => ({ url: `/user/payments/order/${orderId}` }),
    }),
    cancelPayment: builder.mutation<ApiResponse<PaymentResponse>, number>({
      query: (orderId) => ({
        url: `/user/payments/cancel/order/${orderId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),
    getAllPaymentMethods: builder.query<ApiResponse<PaymentMethod[]>, void>({
      query: () => ({ url: '/public/payment-methods' }),
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentByOrderIdQuery,
  useCancelPaymentMutation,
  useGetAllPaymentMethodsQuery,
} = paymentApi;
