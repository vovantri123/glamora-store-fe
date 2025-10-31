import { baseApi } from '@/lib/api/baseApi';
import { ApiResponse } from '@/types/api.type';
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '../types';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => ({ url: '/user/cart' }),
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<ApiResponse<Cart>, AddToCartRequest>({
      query: (data) => ({
        url: '/user/cart/items',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Cart'],
      // Optimistic update
      async onQueryStarted(request, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update cache with server response
          dispatch(
            cartApi.util.updateQueryData('getCart', undefined, (draft) => {
              if (data.data) {
                draft.data = data.data;
              }
            })
          );
        } catch {
          // Error handled by component
        }
      },
    }),
    updateCartItem: builder.mutation<
      ApiResponse<Cart>,
      { itemId: number; data: UpdateCartItemRequest }
    >({
      query: ({ itemId, data }) => ({
        url: `/user/cart/items/${itemId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Cart'],
      // Optimistic update
      async onQueryStarted({ itemId, data }, { dispatch, queryFulfilled }) {
        // Optimistic cache update
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            if (draft.data) {
              const item = draft.data.items.find((i) => i.id === itemId);
              if (item) {
                const quantityDiff = data.quantity - item.quantity;
                const priceDiff = item.variant.price * quantityDiff;

                item.quantity = data.quantity;
                item.subtotal = item.variant.price * data.quantity;

                draft.data.totalItems += quantityDiff;
                draft.data.totalAmount += priceDiff;
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
    }),
    removeCartItem: builder.mutation<ApiResponse<Cart>, number>({
      query: (itemId) => ({
        url: `/user/cart/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
      // Optimistic update
      async onQueryStarted(itemId, { dispatch, queryFulfilled }) {
        // Optimistic cache update
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            if (draft.data) {
              const itemIndex = draft.data.items.findIndex(
                (i) => i.id === itemId
              );
              if (itemIndex >= 0) {
                const removedItem = draft.data.items[itemIndex];
                draft.data.totalItems -= removedItem.quantity;
                draft.data.totalAmount -= removedItem.subtotal;
                draft.data.items.splice(itemIndex, 1);
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
    }),
    clearCart: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/user/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
