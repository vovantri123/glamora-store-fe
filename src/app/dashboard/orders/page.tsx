'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    {
      id: '#1001',
      date: 'Dec 15, 2024',
      total: '$299.99',
      status: 'Delivered',
      items: 3,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      id: '#1002',
      date: 'Dec 20, 2024',
      total: '$149.99',
      status: 'In Transit',
      items: 2,
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      id: '#1003',
      date: 'Dec 22, 2024',
      total: '$89.99',
      status: 'Processing',
      items: 1,
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Orders</h2>
        <p className="mt-1 text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const Icon = order.icon;
          return (
            <Card
              key={order.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order {order.id}</CardTitle>
                    <CardDescription>{order.date}</CardDescription>
                  </div>
                  <div className={`rounded-lg p-2 ${order.bgColor}`}>
                    <Icon className={`h-6 w-6 ${order.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {order.items} items
                    </p>
                    <p className="text-2xl font-bold">{order.total}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${order.bgColor} ${order.color}`}
                  >
                    {order.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
