'use client';

import React from 'react';
import Image from 'next/image';
import { Truck } from 'lucide-react';
import type { CartItem } from '@/features/cart/types/cart.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface OrderItemsCardProps {
  items: CartItem[];
}

export default function OrderItemsCard({ items }: OrderItemsCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-2 shadow-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent">
            Products ({items.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={item.variant.imageUrl || '/placeholder.png'}
                  alt={item.variant.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="line-clamp-1 font-medium">
                  {item.variant.product.name}
                </h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {item.variant.attributes.map((attr) => (
                    <Badge
                      key={attr.attributeName}
                      variant="outline"
                      className="text-xs"
                    >
                      {attr.attributeName}: {attr.valueName}
                    </Badge>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    x{item.quantity}
                  </span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
