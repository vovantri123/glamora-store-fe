'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchOrdersQuery } from '@/features/order/api/adminOrderApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  PackageX,
  Loader2,
  Eye,
  Truck,
  User,
  Mail,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import {
  useUpdateOrderStatusMutation,
  type AdminOrder,
} from '@/features/order/api/adminOrderApi';
import { toast } from 'sonner';
import type { Order } from '@/features/order/api/orderApi';
import Image from 'next/image';

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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL_CONFIRMED');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchType, setSearchType] = useState<
    'orderCode' | 'userEmail' | 'userFullName'
  >('orderCode');

  // Ship order dialog
  const [showShipDialog, setShowShipDialog] = useState(false);
  const [orderToShip, setOrderToShip] = useState<AdminOrder | null>(null);

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const params: Record<string, string | number | undefined> = {
    page,
    size: 20,
    sortBy: 'createdAt',
    sortDir: 'desc',
  };

  // Handle custom filters
  if (statusFilter === 'ALL_CONFIRMED') {
    params.status = 'CONFIRMED';
  } else if (statusFilter === 'COD_PENDING') {
    params.status = 'CONFIRMED';
    params.paymentStatus = 'PENDING';
  } else if (statusFilter === 'VNPAY_SUCCESS') {
    params.status = 'CONFIRMED';
    params.paymentStatus = 'SUCCESS';
  } else {
    params.status = statusFilter;
  }

  if (searchQuery) {
    params[searchType] = searchQuery;
  }

  const { data, isLoading, isFetching } = useSearchOrdersQuery(params);

  const orders = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  // Fetch counts for all statuses
  // size: 1 là mẹo để chỉ cần lấy metadata (như totalElements) mà không tải toàn bộ danh sách
  const { data: pendingData } = useSearchOrdersQuery({
    page: 0,
    size: 1,
    status: 'PENDING',
  });
  const { data: confirmedData } = useSearchOrdersQuery({
    page: 0,
    size: 1,
    status: 'CONFIRMED',
  });
  const { data: shippingData } = useSearchOrdersQuery({
    page: 0,
    size: 1,
    status: 'SHIPPING',
  });
  const { data: completedData } = useSearchOrdersQuery({
    page: 0,
    size: 1,
    status: 'COMPLETED',
  });
  const { data: canceledData } = useSearchOrdersQuery({
    page: 0,
    size: 1,
    status: 'CANCELED',
  });

  const statusCounts = {
    PENDING: pendingData?.data?.totalElements || 0,
    ALL_CONFIRMED: confirmedData?.data?.totalElements || 0,
    SHIPPING: shippingData?.data?.totalElements || 0,
    COMPLETED: completedData?.data?.totalElements || 0,
    CANCELED: canceledData?.data?.totalElements || 0,
  };

  const handleSearch = () => {
    setSearchQuery(inputValue);
    setPage(0);
  };

  const handleViewDetail = (orderId: number) => {
    router.push(`/orders/${orderId}?from=admin`);
  };

  const handleOpenShipDialog = (order: AdminOrder) => {
    setOrderToShip(order);
    setShowShipDialog(true);
  };

  const handleShipOrder = async () => {
    if (!orderToShip) return;

    try {
      await updateOrderStatus({
        orderId: orderToShip.id,
        data: {
          status: 'SHIPPING',
        },
      }).unwrap();
      toast.success('Đã chuyển đơn hàng sang trạng thái Đang giao!');
      setShowShipDialog(false);
      setOrderToShip(null);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
          <p className="mt-1 text-muted-foreground">
            Theo dõi và xử lý đơn hàng
          </p>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(0);
          }}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="PENDING" className="gap-2">
              <span className="hidden sm:inline">Chờ TT</span>
              <span className="sm:hidden">Chờ</span>
              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                {statusCounts.PENDING}
              </span>
            </TabsTrigger>
            <TabsTrigger value="ALL_CONFIRMED" className="gap-2">
              <span className="hidden sm:inline">Đã xác nhận</span>
              <span className="sm:hidden">XN</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                {statusCounts.ALL_CONFIRMED}
              </span>
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

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 gap-2">
            <Select
              value={searchType}
              onValueChange={(v) => setSearchType(v as typeof searchType)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orderCode">Mã đơn</SelectItem>
                <SelectItem value="userEmail">Email</SelectItem>
                <SelectItem value="userFullName">Tên KH</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={`Tìm theo ${searchType === 'orderCode' ? 'mã đơn' : searchType === 'userEmail' ? 'email' : 'tên KH'}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : orders.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <PackageX className="h-12 w-12 text-muted-foreground" />
              <EmptyTitle>Không tìm thấy đơn hàng</EmptyTitle>
              <EmptyDescription>
                {searchQuery || statusFilter
                  ? 'Thử điều chỉnh tìm kiếm hoặc bộ lọc'
                  : 'Chưa có đơn hàng nào'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="group transition-all hover:border-orange-200 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left Section - Order Info */}
                    <div className="flex-1 space-y-3">
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          #{order.orderCode}
                        </h3>
                        <Badge
                          className={`${STATUS_COLORS[order.status]} px-3 py-1`}
                        >
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

                      {/* Customer Info Grid */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Khách hàng</p>
                            <p className="font-medium text-gray-900">
                              {order.userFullName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <Mail className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="max-w-[200px] truncate font-medium text-gray-900">
                              {order.userEmail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Ngày đặt</p>
                            <p className="font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString(
                                'vi-VN',
                                {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                            <CreditCard className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tổng tiền</p>
                            <p className="text-lg font-bold text-orange-600">
                              <span>{formatPrice(order.totalAmount || 0)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex gap-2 lg:flex-col lg:justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(order.id)}
                        className="flex-1 border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 lg:flex-none"
                      >
                        <Eye className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Xem chi tiết</span>
                      </Button>
                      {order.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenShipDialog(order)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md hover:from-purple-700 hover:to-purple-800 lg:flex-none"
                        >
                          <Truck className="h-4 w-4 lg:mr-2" />
                          <span className="hidden lg:inline">
                            {order.paymentStatus === 'SUCCESS'
                              ? 'Giao hàng'
                              : 'Ship & Thu tiền'}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isFetching}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isFetching}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Ship Order Confirmation Dialog */}
      <Dialog open={showShipDialog} onOpenChange={setShowShipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận giao hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn chuyển đơn hàng #{orderToShip?.orderCode}{' '}
              sang trạng thái <strong>Đang giao</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowShipDialog(false);
                setOrderToShip(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleShipOrder}
              disabled={isUpdating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Xác nhận giao hàng
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
