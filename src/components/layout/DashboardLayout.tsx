'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useGetProfileQuery } from '@/features/auth/api/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { resetApiState } from '@/lib/api/baseApi';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get auth state to check if user is authenticated
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Skip query when not authenticated to prevent unnecessary API calls
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = profileData?.data;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetApiState());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-slate-950 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent">
                Glamora
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="border-b px-6 py-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarImage
                  src={user?.avatar || undefined}
                  alt={user?.fullName}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {user?.fullName || 'User'}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive && 'text-primary-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-6 backdrop-blur-sm dark:bg-slate-950/80">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navigation.find((item) => item.href === pathname)?.name ||
                'Dashboard'}
            </h1>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden items-center gap-3 lg:flex">
            <Avatar className="h-9 w-9 ring-2 ring-primary/20">
              <AvatarImage
                src={user?.avatar || undefined}
                alt={user?.fullName}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-sm text-white">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden xl:block">
              <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
