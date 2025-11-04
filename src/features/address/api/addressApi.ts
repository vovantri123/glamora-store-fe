import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';

export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  streetDetail: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  default: boolean; // Match API response field name
}

export interface AddressCreateRequest {
  receiverName: string;
  receiverPhone: string;
  streetDetail: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  default?: boolean; // Backend expects "default" field name
}

export interface AddressUpdateRequest {
  receiverName?: string;
  receiverPhone?: string;
  streetDetail?: string;
  province?: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  default?: boolean; // Backend expects "default" field name
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMyAddresses: builder.query<ApiResponse<Address[]>, void>({
      query: () => ({ url: '/user/addresses' }),
      providesTags: ['Address'],
    }),
    getAddressById: builder.query<ApiResponse<Address>, number>({
      query: (id) => ({ url: `/user/addresses/${id}` }),
      providesTags: ['Address'],
    }),
    getDefaultAddress: builder.query<ApiResponse<Address>, void>({
      query: () => ({ url: '/user/addresses/default' }),
      providesTags: ['Address'],
    }),
    createAddress: builder.mutation<ApiResponse<Address>, AddressCreateRequest>(
      {
        query: (data) => ({
          url: '/user/addresses',
          method: 'POST',
          data,
        }),
        invalidatesTags: ['Address'],
      }
    ),
    updateAddress: builder.mutation<
      ApiResponse<Address>,
      { id: number; data: AddressUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/user/addresses/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Address'],
    }),
    setDefaultAddress: builder.mutation<ApiResponse<Address>, number>({
      query: (id) => ({
        url: `/user/addresses/${id}/set-default`,
        method: 'PUT',
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation<ApiResponse<string>, number>({
      query: (id) => ({
        url: `/user/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAllMyAddressesQuery,
  useGetAddressByIdQuery,
  useGetDefaultAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
