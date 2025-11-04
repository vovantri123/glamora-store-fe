import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem } from '../types';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
  selectedItemIds: [],
};

/**
 * Cart Slice - Manages cart UI state and optimistic updates
 *
 * @description
 * Redux slice for cart state management. Works alongside RTK Query (cartApi)
 * to provide optimistic UI updates and drawer state management.
 *
 * State:
 * - items: Array of cart items (synced from API)
 * - totalItems: Total quantity of all items
 * - totalAmount: Total price of all items
 * - isOpen: Cart drawer/modal visibility
 *
 * @usage
 * ```typescript
 * const dispatch = useAppDispatch();
 * const { items, isOpen } = useAppSelector((state) => state.cart);
 *
 * // Open cart drawer
 * dispatch(openCart());
 *
 * // Update cart after API response
 * dispatch(setCart({ items, totalItems, totalAmount }));
 * ```
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        totalItems: number;
        totalAmount: number;
      }>
    ) => {
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalAmount = action.payload.totalAmount;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.selectedItemIds = [];
    },
    // Selection management
    toggleItemSelection: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      const index = state.selectedItemIds.indexOf(itemId);
      if (index >= 0) {
        state.selectedItemIds.splice(index, 1);
      } else {
        state.selectedItemIds.push(itemId);
      }
    },
    selectAllItems: (state) => {
      state.selectedItemIds = state.items.map((item) => item.id);
    },
    deselectAllItems: (state) => {
      state.selectedItemIds = [];
    },
    // Remove selected items from cart (after successful checkout)
    removeSelectedItems: (state) => {
      const selectedSet = new Set(state.selectedItemIds);
      state.items = state.items.filter((item) => !selectedSet.has(item.id));
      state.selectedItemIds = [];
      // Recalculate totals
      state.totalItems = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
    },
    // Optimistic update - add item
    optimisticAddItem: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
        state.items[existingIndex].subtotal += action.payload.subtotal;
      } else {
        state.items.push(action.payload);
      }
      state.totalItems += action.payload.quantity;
      state.totalAmount += action.payload.subtotal;
    },
    // Optimistic update - update quantity
    optimisticUpdateItem: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) {
        const quantityDiff = action.payload.quantity - item.quantity;
        const priceDiff = item.variant.price * quantityDiff;

        item.quantity = action.payload.quantity;
        item.subtotal = item.variant.price * action.payload.quantity;

        state.totalItems += quantityDiff;
        state.totalAmount += priceDiff;
      }
    },
    // Optimistic update - remove item
    optimisticRemoveItem: (state, action: PayloadAction<number>) => {
      const itemIndex = state.items.findIndex((i) => i.id === action.payload);
      if (itemIndex >= 0) {
        const removedItem = state.items[itemIndex];
        state.totalItems -= removedItem.quantity;
        state.totalAmount -= removedItem.subtotal;
        state.items.splice(itemIndex, 1);
      }
    },
  },
});

export const {
  setCart,
  openCart,
  closeCart,
  toggleCart,
  clearCart,
  toggleItemSelection,
  selectAllItems,
  deselectAllItems,
  removeSelectedItems,
  optimisticAddItem,
  optimisticUpdateItem,
  optimisticRemoveItem,
} = cartSlice.actions;

export default cartSlice.reducer;
