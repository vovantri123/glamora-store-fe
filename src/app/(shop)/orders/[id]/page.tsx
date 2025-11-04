'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useGetOrderByIdQuery } from '@/features/order/api/orderApi';
import type { Order } from '@/features/order/api/orderApi';

const STATUS_COLORS: Record<Order['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPING: 'bg-purple-100 text-purple-800 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELED: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABELS: Record<Order['status'], string> = {
  PENDING: 'Chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã hủy',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = Number(params.id);

  // Check if user came from admin page
  const fromAdmin = searchParams.get('from') === 'admin';
  const backUrl = fromAdmin ? '/admin/orders' : '/orders';

  const { data, isLoading, error } = useGetOrderByIdQuery(orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Không tìm thấy đơn hàng
          </h1>
          <p className="mb-6 text-gray-600">
            Đơn hàng #{orderId} không tồn tại hoặc bạn không có quyền xem.
          </p>
          <Link href={backUrl}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const order = data.data;
  const items = order.orderItems || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-gray-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Đơn hàng #{order.orderCode}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${STATUS_COLORS[order.status]} px-4 py-2 text-sm`}
            >
              {STATUS_LABELS[order.status]}
            </Badge>
            {/* Payment Method Badge - Always show */}
            <Badge
              className={`px-3 py-2 text-sm font-medium ${
                order.paymentMethodName === 'VNPay'
                  ? 'border-green-200 bg-green-100 text-green-700'
                  : 'border-yellow-200 bg-yellow-100 text-yellow-700'
              }`}
            >
              {order.paymentMethodName || 'COD'}
            </Badge>
          </div>
        </div>

        <p className="mt-2 text-gray-600">
          Ngày đặt:{' '}
          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border bg-gray-50 p-4"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={item.productImageUrl || '/placeholder.png'}
                      alt={item.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 font-semibold text-gray-900">
                      {item.productName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.variantName || item.variantAttributes}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        SL: {item.quantity || 0}
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {formatPrice(item.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Người nhận</p>
                <p className="text-gray-900">{order.recipientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </p>
                <p className="text-gray-900">{order.recipientPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                <p className="text-gray-900">{order.shippingAddressDetail}</p>
              </div>
              {order.note && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Ghi chú</p>
                  <p className="italic text-gray-900">
                    &ldquo;{order.note}&rdquo;
                  </p>
                </div>
              )}
              {order.status === 'CANCELED' && order.canceledReason && (
                <div>
                  <p className="text-sm font-medium text-red-700">Lý do hủy</p>
                  <p className="text-red-900">{order.canceledReason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng kết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span>
                  {formatPrice(order.subtotal || order.totalAmount || 0)}
                </span>
              </div>
              {order.discountAmount !== undefined &&
                order.discountAmount !== null &&
                order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span>{formatPrice(order.shippingFee || 0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-orange-600">
                  {formatPrice(order.totalAmount || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
