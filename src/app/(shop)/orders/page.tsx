'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { useGetMyOrdersQuery } from '@/features/order/api/orderApi';
import { OrderItem } from '@/features/order/components';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: ordersData, isLoading } = useGetMyOrdersQuery({
    page,
    size: 10,
    sort: sortBy,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const orders = ordersData?.data?.content || [];
  const totalPages = ordersData?.data?.totalPages || 0;

  if (isLoading) {
    return (
      <UserLayout>
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
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">My Orders</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* Status Filter Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="flex-1"
          >
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="PENDING">Pending</TabsTrigger>
              <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
              <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
              <TabsTrigger value="SHIPPING">Shipping</TabsTrigger>
              <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
              <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt,desc">Newest First</SelectItem>
              <SelectItem value="createdAt,asc">Oldest First</SelectItem>
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
    </UserLayout>
  );
}
