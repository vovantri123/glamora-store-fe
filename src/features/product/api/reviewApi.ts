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

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviewStats: builder.query<ReviewStatsResponse, number>({
      query: (productId) => ({
        url: `/public/reviews/product/${productId}/stats`,
      }),
    }),
    getReviews: builder.query<
      ReviewApiResponse,
      { productId: number; page?: number; size?: number; rating?: number }
    >({
      query: ({ productId, page = 0, size = 10, rating }) => ({
        url: `/public/reviews/product/${productId}`,
        params: { page, size, ...(rating && { rating }) },
      }),
    }),
  }),
});

export const { useGetReviewStatsQuery, useGetReviewsQuery } = reviewApi;
