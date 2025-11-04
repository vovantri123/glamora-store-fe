import { baseApi } from '@/lib/api/baseApi';

export interface Review {
  id: number;
  userId: number;
  userFullName: string;
  userAvatar?: string;
  productId: number;
  productName: string;
  variantId: number;
  orderId: number;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ReviewStats {
  productId: number;
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface ReviewStatsResponse {
  message: string;
  data: ReviewStats;
}

export interface ReviewListResponse {
  content: Review[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface ReviewApiResponse {
  message: string;
  data: ReviewListResponse;
}

export interface CreateReviewRequest {
  productId: number;
  variantId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getReviewStats: builder.query<ReviewStatsResponse, number>({
      query: (productId) => ({
        url: `/public/reviews/product/${productId}/stats`,
      }),
      providesTags: ['Review'],
    }),
    getReviews: builder.query<
      ReviewApiResponse,
      {
        productId: number;
        page?: number;
        size?: number;
        rating?: number;
        isVerifiedPurchase?: boolean;
      }
    >({
      query: ({
        productId,
        page = 0,
        size = 10,
        rating,
        isVerifiedPurchase,
      }) => ({
        url: `/public/reviews/product/${productId}`,
        params: {
          page,
          size,
          ...(rating && { rating }),
          ...(isVerifiedPurchase !== undefined && { isVerifiedPurchase }),
        },
      }),
      providesTags: ['Review'],
    }),

    // User endpoints
    createReview: builder.mutation<
      { message: string; data: Review },
      CreateReviewRequest
    >({
      query: (data) => ({
        url: '/user/reviews',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Review'],
    }),
    updateReview: builder.mutation<
      { message: string; data: Review },
      { reviewId: number; data: UpdateReviewRequest }
    >({
      query: ({ reviewId, data }) => ({
        url: `/user/reviews/${reviewId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation<{ message: string }, number>({
      query: (reviewId) => ({
        url: `/user/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
    getMyReviews: builder.query<
      ReviewApiResponse,
      { page?: number; size?: number }
    >({
      query: (params) => ({
        url: '/user/reviews',
        params,
      }),
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useGetReviewStatsQuery,
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetMyReviewsQuery,
} = reviewApi;
