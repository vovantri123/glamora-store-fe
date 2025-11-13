'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const orderCode = searchParams.get('orderCode');
  const failedReason = searchParams.get('failedReason');

  // Backend returns 'SUCCESS' for successful payments
  const isSuccess = status === 'SUCCESS' || status === 'COMPLETED';

  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-orange-600" />
          <h2 className="mt-4 text-xl font-semibold">
            Đang xử lý thanh toán...
          </h2>
          <p className="mt-2 text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-md">
        <CardContent className="p-8 text-center">
          {isSuccess ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-green-600">
                Thanh toán thành công!
              </h1>
              <p className="mt-2 text-gray-600">
                Đơn hàng của bạn đã được thanh toán thành công
              </p>

              {orderCode && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="mt-1 text-lg font-semibold">{orderCode}</p>
                </div>
              )}

              {amount && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Số tiền đã thanh toán</p>
                  <p className="mt-1 text-xl font-bold text-orange-600">
                    {formatPrice(Number(amount))}
                  </p>
                </div>
              )}

              <div className="mt-8 space-y-3">
                {orderId && (
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700"
                    asChild
                  >
                    <Link href={`/orders/${orderId}`}>Xem đơn hàng</Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Tiếp tục mua sắm</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-red-600">
                Thanh toán thất bại!
              </h1>
              <p className="mt-2 text-gray-600">
                {failedReason || 'Đã có lỗi xảy ra trong quá trình thanh toán'}
              </p>

              {orderCode && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="mt-1 text-lg font-semibold">{orderCode}</p>
                </div>
              )}

              <div className="mt-8 space-y-3">
                {orderId && (
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700"
                    asChild
                  >
                    <Link href={`/orders/${orderId}`}>Xem đơn hàng</Link>
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cart">Quay lại giỏ hàng</Link>
                </Button>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Nếu bạn gặp vấn đề, vui lòng liên hệ{' '}
                <Link
                  href="/contact"
                  className="text-orange-600 hover:underline"
                >
                  hỗ trợ khách hàng
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-md text-center">
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-orange-600" />
              <h2 className="mt-4 text-xl font-semibold">Đang tải...</h2>
            </div>
          </div>
        }
      >
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
