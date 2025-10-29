'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthGuard } from '@/features/auth/hooks';
import { ShoppingBag, Heart, Package, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthGuard();

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      name: 'Total Orders',
      value: '12',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      name: 'Wishlist Items',
      value: '8',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    },
    {
      name: 'Pending Orders',
      value: '3',
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    },
    {
      name: 'Total Spent',
      value: '$1,234',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.fullName}! 👋
        </h1>
        <p className="mt-2 text-white/90">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchase activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">
                      2 items • $99.99
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/20">
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View All Orders</p>
                  <p className="text-sm text-muted-foreground">
                    Track your purchases
                  </p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">My Wishlist</p>
                  <p className="text-sm text-muted-foreground">Saved items</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
