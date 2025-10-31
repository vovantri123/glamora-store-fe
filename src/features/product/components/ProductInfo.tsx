'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import type {
  Product,
  ProductVariant,
} from '@/features/product/api/productApi';

interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

export default function ProductInfo({
  product,
  selectedVariant,
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-3 text-3xl font-bold lg:text-4xl">{product.name}</h1>

        {/* Rating */}
        {product.averageRating && product.averageRating > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.averageRating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">
              ({product.totalReviews} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <span className="text-4xl font-bold text-orange-600">
            {formatPrice(selectedVariant?.price || 0)}
          </span>
          {selectedVariant?.compareAtPrice && (
            <>
              <span className="text-2xl text-gray-400 line-through">
                {formatPrice(selectedVariant.compareAtPrice)}
              </span>
              <Badge className="bg-red-500 text-sm font-semibold">
                Save{' '}
                {Math.round(
                  ((selectedVariant.compareAtPrice - selectedVariant.price) /
                    selectedVariant.compareAtPrice) *
                    100
                )}
                %
              </Badge>
            </>
          )}
        </div>

        {/* Stock Status */}
        {selectedVariant && (
          <div className="mb-4 flex items-center gap-3">
            <Badge
              variant={selectedVariant.stock > 0 ? 'default' : 'destructive'}
              className="px-3 py-1"
            >
              {selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </Badge>
            {selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
              <span className="text-sm font-medium text-orange-600">
                Only {selectedVariant.stock} left!
              </span>
            )}
          </div>
        )}
      </div>

      <Separator />
    </div>
  );
}
