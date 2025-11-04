'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Order } from '../api/orderApi';

interface OrderStatusProps {
  status: Order['status'];
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG: Record<
  Order['status'],
  { label: string; color: string; icon: string }
> = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏳',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '💳',
  },
  SHIPPING: {
    label: 'Shipping',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '🚚',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
  },
  CANCELED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '❌',
  },
};

export default function OrderStatus({ status, size = 'md' }: OrderStatusProps) {
  const config = STATUS_CONFIG[status];
  const sizeClass =
    size === 'sm'
      ? 'text-xs px-2 py-1'
      : size === 'lg'
        ? 'text-base px-4 py-2'
        : 'text-sm px-3 py-1.5';

  return (
    <Badge className={`${config.color} ${sizeClass} font-semibold`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
