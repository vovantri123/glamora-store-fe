'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import {
  useConfirmOrderReceivedMutation,
  useCancelOrderMutation,
} from '../api/orderApi';
import { useCreatePaymentMutation } from '@/features/payment/api/paymentApi';
import type { Order as OrderType } from '../api/orderApi';

interface OrderItemProps {
  order: OrderType;
}

const STATUS_COLORS: Record<OrderType['status'], string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
  SHIPPING: 'bg-purple-100 text-purple-800 border-purple-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELED: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_LABELS: Record<OrderType['status'], string> = {
  PENDING: 'Chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELED: 'Đã hủy',
};

export default function OrderItem({ order }: OrderItemProps) {
  const items = order.orderItems || [];
  const [confirmReceived, { isLoading: isConfirming }] =
    useConfirmOrderReceivedMutation();
  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation();
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirmReceived = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await confirmReceived(order.id).unwrap();
      toast.success('Xác nhận nhận hàng thành công!');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Không thể xác nhận nhận hàng');
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder({
        orderId: order.id,
        data: { canceledReason: cancelReason || 'Không muốn mua nữa' },
      }).unwrap();
      toast.success('Hủy đơn hàng thành công!');
      setShowCancelDialog(false);
      setCancelReason('');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const handleContinuePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Payment method ID 2 = VNPay (assuming from backend)
      const result = await createPayment({
        orderId: order.id,
        paymentMethodId: 2,
      }).unwrap();

      if (result.data?.payUrl) {
        // Redirect to VNPay payment page
        window.location.href = result.data.payUrl;
      } else {
        toast.error('Không lấy được URL thanh toán');
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Không thể tạo thanh toán');
    }
  };

  return (
    <>
      <Card className="transition-shadow hover:shadow-lg">
        <CardContent className="p-4">
          <Link href={`/orders/${order.id}`}>
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold">Đơn hàng #{order.orderCode}</h3>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <Badge className={STATUS_COLORS[order.status]}>
                  {STATUS_LABELS[order.status]}
                </Badge>
                {/* Payment Method Badge - Always show */}
                <Badge
                  className={`px-2 py-1 text-xs font-medium ${
                    order.paymentMethodName === 'VNPay'
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-yellow-200 bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.paymentMethodName || 'COD'}
                </Badge>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="mb-4 space-y-2">
              {items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex gap-2">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image
                      src={item.productImageUrl || '/placeholder.png'}
                      alt={item.productName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {item.productName}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {item.variantName || item.variantAttributes} ×{' '}
                        {item.quantity || 0}
                      </span>
                      <span className="font-medium text-orange-600">
                        {formatPrice(item.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {items.length > 2 && (
                <p className="text-sm text-gray-500">
                  +{items.length - 2} sản phẩm khác
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t pt-3">
              {order.status === 'CANCELED' && order.canceledReason && (
                <div className="mb-3 rounded-md bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">Lý do hủy:</p>
                  <p className="text-sm text-red-700">{order.canceledReason}</p>
                </div>
              )}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {items.length} sản phẩm
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Tổng tiền</p>
                  <p className="text-xl font-bold text-orange-600">
                    {formatPrice(order.totalAmount || 0)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Confirm Received Button for SHIPPING status */}
                {order.status === 'SHIPPING' && (
                  <Button
                    onClick={handleConfirmReceived}
                    disabled={isConfirming}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đã nhận được hàng'
                    )}
                  </Button>
                )}

                {/* Continue Payment Button for PENDING status */}
                {order.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={handleContinuePayment}
                      disabled={isCreatingPayment}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {isCreatingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Thanh toán VNPay'
                      )}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowCancelDialog(true);
                      }}
                      disabled={isCanceling}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {isCanceling ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang hủy...
                        </>
                      ) : (
                        'Hủy đơn'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #{order.orderCode}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Lý do hủy (tùy chọn)</Label>
            <Textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason('');
              }}
            >
              Đóng
            </Button>
            <Button
              onClick={handleCancelOrder}
              disabled={isCanceling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                'Xác nhận hủy'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
