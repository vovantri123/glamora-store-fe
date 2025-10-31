'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyCart() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center py-12">
      <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
        <ShoppingCart className="h-16 w-16 text-gray-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
      <p className="mb-6 text-gray-500">
        Looks like you haven&apos;t added anything to your cart yet
      </p>
      <Button
        asChild
        size="lg"
        className="bg-gradient-to-r from-orange-600 to-orange-700"
      >
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
