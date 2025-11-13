'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useGetProfileQuery,
  useLogoutMutation,
} from '@/features/auth/api/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { resetApiState } from '@/lib/api/baseApi';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Users,
  Package,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Users', href: '/admin/users', icon: Users },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  // Get auth state to check if user is authenticated
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Skip query when not authenticated to prevent unnecessary API calls
  // Khi isAuthenticated thay đổi, RTK Query sẽ tự động chạy lại hook → nên skip cũng được đánh giá lại,
  // và request sẽ được gửi hoặc bị bỏ qua tùy vào giá trị mới của isAuthenticated
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const user = profileData?.data;

  const handleLogout = async () => {
    try {
      // Get refresh token
      const refreshToken =
        localStorage.getItem('refreshToken') ||
        sessionStorage.getItem('refreshToken');

      if (refreshToken) {
        // Call logout API to revoke refresh token
        await logoutApi({ refreshToken }).unwrap();
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue logout even if API fails
    } finally {
      // ✅ Reset API state TRƯỚC để hủy các request pending
      dispatch(resetApiState());
      // Clear local state
      dispatch(logout());
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile sidebar backdrop, cho phép click ở ngoài để đóng sidebar */}
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
            <Link href="/admin" className="flex items-center gap-2">
              <Store className="h-9 w-9 text-primary"></Store>
              <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-xl font-bold text-transparent">
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
            {adminNavigation.map((item) => {
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
              {adminNavigation.find((item) => item.href === pathname)?.name ||
                'Dashboard'}
            </h1>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-gray-100 focus:outline-none">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                  {user?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left xl:block">
                <p className="text-sm font-medium">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ''}
                </p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => router.push('/admin/profile')}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/admin/settings')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
