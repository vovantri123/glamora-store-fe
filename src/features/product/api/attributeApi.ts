import { baseApi } from '@/lib/api/baseApi';
import { Attribute } from '../types/attribute.types';

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query<{ message: string; data: Attribute[] }, void>({
      query: () => ({
        url: '/admin/attributes',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAttributesQuery } = attributeApi;
