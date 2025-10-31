'use client';

import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 px-4">
      <Card className="w-full max-w-2xl border-none shadow-2xl">
        <CardContent className="p-8 text-center md:p-12">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-9xl font-bold text-transparent">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Oops! Trang không tồn tại
            </h2>
            <p className="text-lg text-gray-600">
              Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
              không khả dụng.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 sm:w-auto"
              >
                <Home className="mr-2 h-5 w-5" />
                Về trang chủ
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Xem sản phẩm
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
