'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Tag, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  isProcessing: boolean;
  canCheckout: boolean;
  onCheckout: () => void;
  distance?: number; // Distance in km (optional, from selected address)
  // Voucher props
  voucherCode: string;
  appliedVoucher: { code: string; discountAmount: number } | null;
  isCalculating: boolean;
  onVoucherCodeChange: (code: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
}

export default function OrderSummary({
  subtotal,
  shippingFee,
  discountAmount,
  finalAmount,
  paymentMethod,
  isProcessing,
  canCheckout,
  onCheckout,
  distance,
  voucherCode,
  appliedVoucher,
  isCalculating,
  onVoucherCodeChange,
  onApplyVoucher,
  onRemoveVoucher,
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-4 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-2 shadow-lg">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent">
            Order Summary
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voucher Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            💳 Discount Code
          </label>
          {appliedVoucher ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 font-mono text-xs">
                      {appliedVoucher.code}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-bold text-green-700">
                    - {formatPrice(appliedVoucher.discountAmount)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={onRemoveVoucher}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-700">
                  💡 This voucher will be reserved when you place the order
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Enter voucher code"
                    value={voucherCode}
                    onChange={(e) =>
                      onVoucherCodeChange(e.target.value.toUpperCase())
                    }
                    className="pl-10 font-mono"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        onApplyVoucher();
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={onApplyVoucher}
                  disabled={isCalculating || !voucherCode.trim()}
                  className="border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100"
                >
                  {isCalculating ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></span>
                      Checking
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Price Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          {distance !== undefined && distance > 0 && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>📍 Distance to Store</span>
              <span>{distance.toFixed(2)} km</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="font-medium">
              {shippingFee === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                <>{formatPrice(shippingFee)}</>
              )}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-orange-600">{formatPrice(finalAmount)}</span>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700"
          size="lg"
          onClick={onCheckout}
          disabled={!canCheckout || isProcessing}
        >
          {isProcessing
            ? 'Processing...'
            : paymentMethod.toLowerCase().includes('cod')
              ? 'Place Order'
              : 'Pay Online'}
        </Button>
      </CardContent>
    </Card>
  );
}
