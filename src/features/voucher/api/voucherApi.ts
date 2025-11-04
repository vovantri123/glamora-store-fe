import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface VoucherDiscountResponse {
  voucherCode: string;
  voucherId?: number;
  discountAmount: number;
  finalAmount: number;
}

export const voucherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveVouchers: builder.query<ApiResponse<Voucher[]>, void>({
      query: () => ({ url: '/user/vouchers/active' }),
    }),
    getMyVouchers: builder.query<ApiResponse<Voucher[]>, void>({
      query: () => ({ url: '/user/vouchers/my-vouchers' }),
      providesTags: ['Voucher'],
    }),
    collectVoucher: builder.mutation<
      ApiResponse<Voucher>,
      { voucherCode: string }
    >({
      query: (data) => ({
        url: '/user/vouchers/collect',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Voucher'],
    }),
    calculateVoucherDiscount: builder.mutation<
      ApiResponse<VoucherDiscountResponse>,
      { voucherCode: string; orderAmount: number }
    >({
      query: ({ voucherCode, orderAmount }) => ({
        url: `/user/vouchers/calculate-discount?orderAmount=${orderAmount}`,
        method: 'POST',
        data: { voucherCode },
      }),
    }),
    applyVoucherDirectly: builder.mutation<
      ApiResponse<VoucherDiscountResponse>,
      { voucherCode: string; orderAmount: number }
    >({
      query: ({ voucherCode, orderAmount }) => ({
        url: `/user/vouchers/apply?orderAmount=${orderAmount}`,
        method: 'POST',
        data: { voucherCode },
      }),
    }),
  }),
});

export const {
  useGetActiveVouchersQuery,
  useGetMyVouchersQuery,
  useCollectVoucherMutation,
  useCalculateVoucherDiscountMutation,
  useApplyVoucherDirectlyMutation,
} = voucherApi;
