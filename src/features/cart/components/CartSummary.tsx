'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Truck } from 'lucide-react';
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

  const shippingFee = cart.totalAmount >= 500000 ? 0 : 30000;
  const finalTotal = cart.totalAmount + shippingFee;

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({cart.totalItems} items)
            </span>
            <span className="font-medium">{formatPrice(cart.totalAmount)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Truck className="h-4 w-4" />
              Shipping
            </span>
            <div className="text-right">
              {shippingFee === 0 ? (
                <Badge className="bg-green-500">FREE</Badge>
              ) : (
                <span className="font-medium">{formatPrice(shippingFee)}</span>
              )}
            </div>
          </div>

          {cart.totalAmount < 500000 && shippingFee > 0 && (
            <p className="text-xs text-gray-500">
              Add {formatPrice(500000 - cart.totalAmount)} more to get FREE
              shipping!
            </p>
          )}

          <Separator />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-orange-600">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>

        {!isCheckout && (
          <Button
            size="lg"
            className="mt-6 w-full bg-gradient-to-r from-orange-600 to-orange-700 py-6 text-base font-semibold"
            onClick={() => router.push('/checkout')}
            disabled={cart.items.length === 0}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Proceed to Checkout
          </Button>
        )}

        {/* Trust Badges */}
        <div className="mt-6 space-y-2 border-t pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <Truck className="h-4 w-4 text-orange-600" />
            </div>
            <span>Free shipping on orders over {formatPrice(500000)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
              <ShoppingBag className="h-4 w-4 text-orange-600" />
            </div>
            <span>Easy 30-day returns</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
