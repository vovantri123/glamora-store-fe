'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAddToCartMutation } from '@/features/cart/api/cartApi';
import { useAppSelector } from '@/lib/store/hooks';
import { toast } from 'sonner';
import type {
  Product,
  ProductVariant,
} from '@/features/product/api/productApi';

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    setShowVariantDialog(true);
  };

  const handleAddToCart = async () => {
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
      setShowVariantDialog(false);
      setQuantity(1);
      setSelectedVariant(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to add to cart');
    }
  };

  const maxStock = selectedVariant?.stock || 0;

  return (
    <>
      {/* Add to Cart Button */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 py-6 text-base font-semibold shadow-md transition-all hover:from-orange-700 hover:to-orange-800 hover:shadow-lg"
          onClick={handleOpenDialog}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </div>

      {/* Variant Selection Dialog */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Variant</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Info */}
            <div className="rounded-lg border bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Choose from available variants below
              </p>
            </div>

            {/* Variants List */}
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const isOutOfStock = variant.stock <= 0;

                return (
                  <div
                    key={variant.id}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    } ${isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Variant Image */}
                      <div className="flex-shrink-0">
                        {variant.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={variant.imageUrl}
                            alt={variant.attributes
                              .map((a) => a.attributeValue)
                              .join(' ')}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex-1">
                          {/* Variant Attributes */}
                          <div className="mb-2 flex flex-wrap gap-2">
                            {variant.attributes.map((attr) => (
                              <Badge
                                key={attr.attributeName}
                                variant="outline"
                                className={
                                  isSelected
                                    ? 'border-orange-600 bg-orange-100 text-orange-700'
                                    : ''
                                }
                              >
                                {attr.attributeName}: {attr.attributeValue}
                              </Badge>
                            ))}
                          </div>

                          {/* Price and Stock */}
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-orange-600">
                              ${variant.price.toFixed(2)}
                            </span>
                            {variant.compareAtPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ${variant.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                            {isOutOfStock ? (
                              <Badge variant="destructive">Out of Stock</Badge>
                            ) : variant.stock < 10 ? (
                              <Badge
                                variant="outline"
                                className="text-orange-600"
                              >
                                Only {variant.stock} left
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {variant.stock} available
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Selected Check */}
                        {isSelected && (
                          <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            {selectedVariant && (
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
                          Math.min(
                            maxStock,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                      className="h-10 w-16 border-x border-gray-300 text-center outline-none"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-l-none"
                      onClick={() =>
                        setQuantity(Math.min(maxStock, quantity + 1))
                      }
                      disabled={quantity >= maxStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {maxStock} items available
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVariantDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || addingToCart}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
