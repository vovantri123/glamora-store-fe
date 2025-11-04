'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingBag, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  selectAllItems,
  deselectAllItems,
  toggleItemSelection,
} from '../store/cartSlice';
import { formatPrice } from '@/lib/utils';
import type { Cart } from '../types';

interface CartSummaryProps {
  cart: Cart;
  isCheckout?: boolean;
}

export default function CartSummary({
  cart,
  isCheckout = false,
}: CartSummaryProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedItemIds = useAppSelector((state) => state.cart.selectedItemIds);

  const isAllSelected =
    selectedItemIds.length === cart.items.length && cart.items.length > 0;
  const isSomeSelected =
    selectedItemIds.length > 0 && selectedItemIds.length < cart.items.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all items
      selectedItemIds.forEach((itemId) => {
        dispatch(toggleItemSelection(itemId));
      });
    } else {
      // Select all items from the current cart
      cart.items.forEach((item) => {
        if (!selectedItemIds.includes(item.id)) {
          dispatch(toggleItemSelection(item.id));
        }
      });
    }
  };

  // Calculate totals based on selected items
  const selectedItems = useMemo(() => {
    return cart.items.filter((item) => selectedItemIds.includes(item.id));
  }, [cart.items, selectedItemIds]);

  const selectedSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );
  const selectedTotalItems = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-bold">Order Summary</h3>
        </div>

        {/* Select All Checkbox */}
        {!isCheckout && cart.items.length > 0 && (
          <div className="mb-4">
            <div
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 bg-white p-4 shadow-sm transition-colors ${
                isAllSelected ? 'border-orange-400' : 'border-gray-300'
              }`}
              onClick={handleToggleSelectAll}
            >
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor="select-all"
                className="flex-1 select-none text-sm font-semibold text-gray-900"
              >
                Select All Items
                <span className="ml-2 text-xs font-normal text-gray-600">
                  ({cart.items.length} total)
                </span>
              </label>
              {isSomeSelected && (
                <div className="flex items-center gap-1 text-xs font-medium text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>
                    {selectedItems.length} of {cart.items.length} selected
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Selection Warning */}
        {!isCheckout && selectedItems.length === 0 && (
          <Alert className="mb-4 border-amber-300 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              Please select items to proceed to checkout
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Selected Items</span>
            <span className="font-semibold text-orange-600">
              {selectedTotalItems} {selectedTotalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-lg font-bold">
              {formatPrice(selectedSubtotal)}
            </span>
          </div>

          <Separator />
        </div>

        {!isCheckout && (
          <>
            <Button
              size="lg"
              className="mt-6 w-full bg-gradient-to-r from-orange-600 to-orange-700 py-6 text-base font-semibold shadow-lg transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500"
              onClick={() => router.push('/checkout')}
              disabled={selectedItems.length === 0}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {selectedItems.length === 0
                ? 'Select Items First'
                : `Checkout (${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'})`}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
