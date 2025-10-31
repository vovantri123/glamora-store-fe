import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl?: string;
  attributes: {
    attributeName: string;
    attributeValue: string;
  }[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  minPrice: number;
  maxPrice: number;
  thumbnailUrl: string;
  images: ProductImage[];
  variants: ProductVariant[];
  totalStock: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface ProductsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      ApiResponse<PageResponse<Product>>,
      ProductsParams
    >({
      query: (params) => ({
        url: '/public/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductById: builder.query<ApiResponse<Product>, number>({
      query: (id) => ({ url: `/public/products/${id}` }),
      providesTags: ['Product'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
