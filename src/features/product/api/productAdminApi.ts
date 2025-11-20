import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductsParams,
  ProductVariant,
  ProductVariantCreateRequest,
  ProductVariantUpdateRequest,
  ProductVariantsParams,
  ProductImage,
  ProductImageCreateRequest,
  ProductImageUpdateRequest,
  ProductImagesParams,
  ProductReview,
  ProductReviewUpdateRequest,
  ProductReviewsParams,
} from '../types/product-admin.types';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const productAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== PRODUCTS ==========
    getProducts: builder.query<
      ApiResponse<PageResponse<Product>>,
      ProductsParams
    >({
      query: (params) => ({
        url: '/admin/products',
        params,
      }),
      providesTags: ['Product'],
    }),

    getProductById: builder.query<ApiResponse<Product>, number>({
      query: (productId) => ({ url: `/admin/products/${productId}` }),
      providesTags: ['Product'],
    }),

    createProduct: builder.mutation<ApiResponse<Product>, ProductCreateRequest>(
      {
        query: (data) => ({
          url: '/admin/products',
          method: 'POST',
          data,
        }),
        invalidatesTags: ['Product'],
      }
    ),

    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { productId: number; data: ProductUpdateRequest }
    >({
      query: ({ productId, data }) => ({
        url: `/admin/products/${productId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Product'],
    }),

    deleteProduct: builder.mutation<ApiResponse<string>, number>({
      query: (productId) => ({
        url: `/admin/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    activateProduct: builder.mutation<ApiResponse<Product>, number>({
      query: (productId) => ({
        url: `/admin/products/${productId}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),

    // ========== PRODUCT VARIANTS ==========
    getProductVariants: builder.query<
      ApiResponse<PageResponse<ProductVariant>>,
      ProductVariantsParams
    >({
      query: (params) => ({
        url: '/admin/product-variants',
        params,
      }),
      providesTags: ['ProductVariant'],
    }),

    getProductVariantById: builder.query<ApiResponse<ProductVariant>, number>({
      query: (variantId) => ({ url: `/admin/product-variants/${variantId}` }),
      providesTags: ['ProductVariant'],
    }),

    createProductVariant: builder.mutation<
      ApiResponse<ProductVariant>,
      ProductVariantCreateRequest
    >({
      query: (data) => ({
        url: '/admin/product-variants',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['ProductVariant'],
    }),

    updateProductVariant: builder.mutation<
      ApiResponse<ProductVariant>,
      { variantId: number; data: ProductVariantUpdateRequest }
    >({
      query: ({ variantId, data }) => ({
        url: `/admin/product-variants/${variantId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['ProductVariant'],
    }),

    deleteProductVariant: builder.mutation<ApiResponse<string>, number>({
      query: (variantId) => ({
        url: `/admin/product-variants/${variantId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductVariant'],
    }),

    activateProductVariant: builder.mutation<
      ApiResponse<ProductVariant>,
      number
    >({
      query: (variantId) => ({
        url: `/admin/product-variants/${variantId}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: ['ProductVariant'],
    }),

    // ========== PRODUCT IMAGES ==========
    getProductImages: builder.query<
      ApiResponse<PageResponse<ProductImage>>,
      ProductImagesParams
    >({
      query: (params) => ({
        url: '/admin/product-images',
        params,
      }),
      providesTags: ['ProductImage'],
    }),

    getProductImageById: builder.query<ApiResponse<ProductImage>, number>({
      query: (imageId) => ({ url: `/admin/product-images/${imageId}` }),
      providesTags: ['ProductImage'],
    }),

    createProductImage: builder.mutation<
      ApiResponse<ProductImage>,
      ProductImageCreateRequest
    >({
      query: (data) => ({
        url: '/admin/product-images',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['ProductImage'],
    }),

    updateProductImage: builder.mutation<
      ApiResponse<ProductImage>,
      { imageId: number; data: ProductImageUpdateRequest }
    >({
      query: ({ imageId, data }) => ({
        url: `/admin/product-images/${imageId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['ProductImage'],
    }),

    deleteProductImage: builder.mutation<ApiResponse<string>, number>({
      query: (imageId) => ({
        url: `/admin/product-images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductImage', 'Product'],
    }),

    setProductImageAsThumbnail: builder.mutation<
      ApiResponse<ProductImage>,
      number
    >({
      query: (imageId) => ({
        url: `/admin/product-images/${imageId}/set-thumbnail`,
        method: 'PUT',
      }),
      invalidatesTags: ['ProductImage', 'Product'],
    }),

    // ========== PRODUCT REVIEWS ==========
    getProductReviews: builder.query<
      ApiResponse<PageResponse<ProductReview>>,
      ProductReviewsParams
    >({
      query: (params) => ({
        url: '/admin/reviews',
        params,
      }),
      providesTags: ['ProductReview'],
    }),

    getProductReviewById: builder.query<ApiResponse<ProductReview>, number>({
      query: (reviewId) => ({ url: `/admin/reviews/${reviewId}` }),
      providesTags: ['ProductReview'],
    }),

    updateProductReview: builder.mutation<
      ApiResponse<ProductReview>,
      { reviewId: number; data: ProductReviewUpdateRequest }
    >({
      query: ({ reviewId, data }) => ({
        url: `/admin/reviews/${reviewId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['ProductReview'],
    }),

    deleteProductReview: builder.mutation<ApiResponse<string>, number>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductReview'],
    }),

    activateProductReview: builder.mutation<ApiResponse<ProductReview>, number>(
      {
        query: (reviewId) => ({
          url: `/admin/reviews/${reviewId}/activate`,
          method: 'PUT',
        }),
        invalidatesTags: ['ProductReview'],
      }
    ),
  }),
  overrideExisting: false,
});

export const {
  // Products
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useActivateProductMutation,
  // Variants
  useGetProductVariantsQuery,
  useGetProductVariantByIdQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useActivateProductVariantMutation,
  // Images
  useGetProductImagesQuery,
  useGetProductImageByIdQuery,
  useCreateProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  useSetProductImageAsThumbnailMutation,
  // Reviews
  useGetProductReviewsQuery,
  useGetProductReviewByIdQuery,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
  useActivateProductReviewMutation,
} = productAdminApi;
