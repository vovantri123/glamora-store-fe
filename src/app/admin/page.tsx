'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Users',
      value: '8,549',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Products',
      value: '456',
      change: '+4.1%',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '-2.3%',
      trend: 'down',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="mt-1 text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={`flex items-center text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                >
                  <TrendIcon className="mr-1 h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your store</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity feed coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
