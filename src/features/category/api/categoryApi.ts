import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  parentId: number | null;
  parentName: string | null;
  children: Category[];
  productCount: number;
  createdAt: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRootCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({ url: '/public/categories/root' }),
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<ApiResponse<Category>, number>({
      query: (id) => ({ url: `/public/categories/${id}` }),
      providesTags: ['Category'],
    }),
    getCategoryPath: builder.query<ApiResponse<Category[]>, number>({
      query: (id) => ({ url: `/public/categories/${id}/path` }),
      providesTags: ['Category'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRootCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryPathQuery,
} = categoryApi;
