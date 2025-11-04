'use client';

import React from 'react';
import { Tag, CheckCircle2, X, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface VoucherCardProps {
  voucherCode: string;
  appliedVoucher: {
    code: string;
    voucherId?: number;
    discountAmount: number;
  } | null;
  isCalculating: boolean;
  onVoucherCodeChange: (code: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
}

export default function VoucherCard({
  voucherCode,
  appliedVoucher,
  isCalculating,
  onVoucherCodeChange,
  onApplyVoucher,
  onRemoveVoucher,
}: VoucherCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-2 shadow-lg">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent">
            Voucher & Promotion
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appliedVoucher ? (
          <div className="space-y-3">
            <Alert className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 hover:bg-green-700">
                        {appliedVoucher.code}
                      </Badge>
                      <span className="text-xs text-green-700">Applied</span>
                    </div>
                    <p className="mt-2 text-lg font-bold text-green-800">
                      - {formatPrice(appliedVoucher.discountAmount)}
                    </p>
                    <p className="text-xs text-green-600">
                      You saved {formatPrice(appliedVoucher.discountAmount)}{' '}
                      with this voucher!
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveVoucher}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Enter voucher code (e.g., GLAMORA2025)"
                  value={voucherCode}
                  onChange={(e) =>
                    onVoucherCodeChange(e.target.value.toUpperCase())
                  }
                  disabled={isCalculating}
                  className="pl-10 font-mono"
                />
              </div>
              <Button
                onClick={onApplyVoucher}
                disabled={isCalculating || !voucherCode.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCalculating ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Checking...
                  </>
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              💡 Tip: Vouchers will be reserved when you create an order
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
