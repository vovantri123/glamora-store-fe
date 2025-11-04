'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import UserLayout from '@/components/layout/UserLayout';
import { useGetMyOrdersQuery } from '@/features/order/api/orderApi';
import { OrderItem } from '@/features/order/components';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function OrdersContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const hasShownSuccessToastRef = useRef(false);

  const { data: ordersData, isLoading } = useGetMyOrdersQuery({
    page,
    size: 10,
    sortBy,
    sortDir,
    status: statusFilter,
  });

  const orders = ordersData?.data?.content || [];
  const totalPages = ordersData?.data?.totalPages || 0;

  // Fetch counts for all statuses
  const { data: pendingData } = useGetMyOrdersQuery({
    page: 0,
    size: 1,
    status: 'PENDING',
  });
  const { data: confirmedData } = useGetMyOrdersQuery({
    page: 0,
    size: 1,
    status: 'CONFIRMED',
  });
  const { data: shippingData } = useGetMyOrdersQuery({
    page: 0,
    size: 1,
    status: 'SHIPPING',
  });
  const { data: completedData } = useGetMyOrdersQuery({
    page: 0,
    size: 1,
    status: 'COMPLETED',
  });
  const { data: canceledData } = useGetMyOrdersQuery({
    page: 0,
    size: 1,
    status: 'CANCELED',
  });

  const statusCounts = {
    PENDING: pendingData?.data?.totalElements || 0,
    CONFIRMED: confirmedData?.data?.totalElements || 0,
    SHIPPING: shippingData?.data?.totalElements || 0,
    COMPLETED: completedData?.data?.totalElements || 0,
    CANCELED: canceledData?.data?.totalElements || 0,
  };

  // Check for success payment - only show toast once
  const success = searchParams.get('success');
  const orderCode = searchParams.get('orderCode');

  useEffect(() => {
    if (success === 'true' && orderCode && !hasShownSuccessToastRef.current) {
      toast.success(`Đặt hàng thành công! Mã đơn hàng: ${orderCode}`);
      hasShownSuccessToastRef.current = true;
    }
  }, [success, orderCode]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="mb-4 h-8 w-1/3" />
                <Skeleton className="mb-2 h-20 w-full" />
                <Skeleton className="h-8 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Đơn hàng của tôi</h1>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Status Filter Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(0);
          }}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="PENDING" className="gap-2">
              <span className="hidden sm:inline">Chờ thanh toán</span>
              <span className="sm:hidden">Chờ</span>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                {statusCounts.PENDING}
              </span>
            </TabsTrigger>
            <TabsTrigger value="CONFIRMED" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Đã xác nhận
              <Badge variant="secondary" className="ml-1">
                {statusCounts.CONFIRMED}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="SHIPPING" className="gap-2">
              <span className="hidden sm:inline">Đang giao</span>
              <span className="sm:hidden">Giao</span>
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">
                {statusCounts.SHIPPING}
              </span>
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="gap-2">
              <span className="hidden sm:inline">Hoàn thành</span>
              <span className="sm:hidden">Xong</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                {statusCounts.COMPLETED}
              </span>
            </TabsTrigger>
            <TabsTrigger value="CANCELED" className="gap-2">
              <span className="hidden sm:inline">Đã hủy</span>
              <span className="sm:hidden">Hủy</span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                {statusCounts.CANCELED}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sort */}
        <Select
          value={`${sortBy},${sortDir}`}
          onValueChange={(value) => {
            const [field, direction] = value.split(',');
            setSortBy(field);
            setSortDir(direction as 'asc' | 'desc');
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt,desc">Newest</SelectItem>
            <SelectItem value="createdAt,asc">Oldest</SelectItem>
            <SelectItem value="finalAmount,desc">Highest Amount</SelectItem>
            <SelectItem value="finalAmount,asc">Lowest Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="mx-auto mb-4 h-24 w-24 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold">No orders found</h3>
            <p className="mb-6 text-gray-600">
              You haven&apos;t placed any orders yet
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-orange-600 to-orange-700"
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i ? 'default' : 'outline'}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <UserLayout>
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="mb-4 h-8 w-1/3" />
                    <Skeleton className="mb-2 h-20 w-full" />
                    <Skeleton className="h-8 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        }
      >
        <OrdersContent />
      </Suspense>
    </UserLayout>
  );
}
