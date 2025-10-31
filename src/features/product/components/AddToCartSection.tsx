'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCartMutation } from '@/features/cart/api/cartApi';
import { useAppSelector } from '@/lib/store/hooks';
import { toast } from 'sonner';
import type { ProductVariant } from '@/features/product/api/productApi';

interface AddToCartSectionProps {
  selectedVariant?: ProductVariant;
}

export default function AddToCartSection({
  selectedVariant,
}: AddToCartSectionProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
      }).unwrap();
      toast.success('Added to cart successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to add to cart');
    }
  };

  const maxStock = selectedVariant?.stock || 0;

  return (
    <div className="space-y-6">
      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
          Quantity
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-gray-300">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-r-none"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <input
              type="number"
              min={1}
              max={maxStock}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(maxStock, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className="h-10 w-16 border-x border-gray-300 text-center outline-none"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-l-none"
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              disabled={quantity >= maxStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {selectedVariant && (
            <span className="text-sm text-gray-500">
              {maxStock} items available
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 py-6 text-base font-semibold shadow-md transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-lg"
          onClick={handleAddToCart}
          disabled={!selectedVariant || maxStock === 0 || addingToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        {/* Mua ngay, sao này làm sau */}
      </div>
    </div>
  );
}
