'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import {
  useGetCartQuery,
  useClearCartMutation,
} from '@/features/cart/api/cartApi';
import { CartItem, CartSummary, EmptyCart } from '@/features/cart/components';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function CartPage() {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [clearCart] = useClearCartMutation();

  const cart = cartData?.data;

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success('Cart cleared successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to clear cart');
    }
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-24 w-24" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-16">
          <EmptyCart />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Shopping Cart</h1>
            <p className="text-gray-600">
              {cart.totalItems} items in your cart
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button variant="outline" onClick={handleClearCart}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
