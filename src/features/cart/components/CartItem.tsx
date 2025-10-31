'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from '../api/cartApi';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const [updateCartItem, { isLoading: updating }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: removing }] = useRemoveCartItemMutation();

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.variant.stock) {
      toast.error(`Only ${item.variant.stock} items available`);
      return;
    }

    try {
      await updateCartItem({
        itemId: item.id,
        data: { quantity: newQuantity },
      }).unwrap();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await removeCartItem(item.id).unwrap();
      toast.success('Item removed from cart');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to remove item');
    }
  };

  const isProcessing = updating || removing;

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.variant.product.id}`}
          className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
        >
          <Image
            src={item.variant.imageUrl || '/placeholder.png'}
            alt={item.variant.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link
              href={`/products/${item.variant.product.id}`}
              className="font-semibold hover:text-orange-600"
            >
              {item.variant.product.name}
            </Link>
            <div className="mt-1 flex flex-wrap gap-2">
              {item.variant.attributes.map((attr) => (
                <Badge
                  key={attr.attributeId}
                  variant="outline"
                  className="text-xs"
                >
                  {attr.attributeName}: {attr.valueName}
                </Badge>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              SKU: {item.variant.sku}
            </p>
          </div>

          {/* Price and Controls */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(item.variant.price)}
              </p>
              {item.variant.compareAtPrice && (
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(item.variant.compareAtPrice)}
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isProcessing}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={item.quantity >= item.variant.stock || isProcessing}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleRemove}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subtotal */}
          <p className="mt-2 text-right text-sm font-semibold">
            Subtotal: {formatPrice(item.subtotal)}
          </p>
        </div>
      </div>
    </Card>
  );
}
