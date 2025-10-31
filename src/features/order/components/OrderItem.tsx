'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { Order as OrderType } from '../api/orderApi';

interface OrderItemProps {
  order: OrderType;
}

const STATUS_COLORS: Record<OrderType['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  PROCESSING: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  SHIPPING: 'bg-purple-100 text-purple-800 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABELS: Record<OrderType['status'], string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPING: 'Shipping',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function OrderItem({ order }: OrderItemProps) {
  const items = order.items || [];

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="transition-shadow hover:shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold">
                  Order #{order.orderCode}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Badge className={STATUS_COLORS[order.status]}>
              {STATUS_LABELS[order.status]}
            </Badge>
          </div>

          {/* Order Items Preview */}
          <div className="mb-4 space-y-3">
            {items.slice(0, 2).map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    {item.variantAttributes}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-medium text-orange-600">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {items.length > 2 && (
              <p className="text-sm text-gray-500">
                +{items.length - 2} more item(s)
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-gray-600">
              {items.length} item(s)
            </span>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-orange-600">
                {formatPrice(order.finalAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
