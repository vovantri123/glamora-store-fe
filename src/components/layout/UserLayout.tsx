'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  User,
  Package,
  MapPin,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { resetApiState } from '@/lib/api/baseApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { useGetRootCategoriesQuery } from '@/features/category/api/categoryApi';
import { useGetCartQuery } from '@/features/cart/api/cartApi';
import {
  useGetProfileQuery,
  useLogoutMutation,
} from '@/features/auth/api/authApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Fetch data
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetRootCategoriesQuery();
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const categories = categoriesData?.data || [];
  const cartItemsCount = cartData?.data?.totalItems || 0;
  const profile = profileData?.data;

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
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/products?keyword=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 py-2 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 text-sm">
          <span>✨ Welcome to Glamora Store - Fashion Your Style</span>
          <div className="flex gap-4">
            <Link href="/help" className="hover:underline">
              Help
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          {/* Logo & Search Row */}
          <div className="flex items-center justify-between gap-4 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-700">
                <span className="text-xl font-bold text-white">G</span>
              </div>
              <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-2xl font-bold text-transparent">
                Glamora
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border-2 border-gray-200 py-6 pl-4 pr-12 focus:border-orange-500"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-red-500 p-0">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-gray-100 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                        {profile?.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium md:block">
                      {profile?.fullName || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/dashboard/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push('/orders')}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-orange-700"
                    onClick={() => router.push('/register')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Categories Navigation */}
          <nav className="border-t">
            {categoriesLoading ? (
              <div className="flex gap-6 py-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            ) : (
              <div className="flex gap-8 overflow-x-auto py-3">
                <Link
                  href="/"
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-orange-600 ${
                    pathname === '/' ? 'bg-orange-50 text-orange-600' : ''
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-orange-600 ${
                    pathname === '/products'
                      ? 'bg-orange-50 text-orange-600'
                      : ''
                  }`}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <DropdownMenu key={category.id}>
                    <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-orange-600 focus:outline-none">
                      {category.name}
                      {category.children.length > 0 && (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </DropdownMenuTrigger>
                    {category.children.length > 0 && (
                      <DropdownMenuContent className="w-64">
                        {category.children.map((subCategory) => (
                          <div key={subCategory.id}>
                            <DropdownMenuItem
                              className="cursor-pointer font-medium"
                              onClick={() =>
                                router.push(
                                  `/products?categoryId=${subCategory.id}`
                                )
                              }
                            >
                              {subCategory.name}
                            </DropdownMenuItem>
                            {subCategory.children.length > 0 && (
                              <div className="ml-4">
                                {subCategory.children.map((childCategory) => (
                                  <DropdownMenuItem
                                    key={childCategory.id}
                                    className="cursor-pointer text-sm text-gray-600"
                                    onClick={() =>
                                      router.push(
                                        `/products?categoryId=${childCategory.id}`
                                      )
                                    }
                                  >
                                    {childCategory.name}
                                  </DropdownMenuItem>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                ))}
                <Link
                  href="/about"
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-orange-600 ${
                    pathname === '/about' ? 'bg-orange-50 text-orange-600' : ''
                  }`}
                >
                  About Us
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b bg-white shadow-lg md:hidden">
          <div className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <div key={category.id} className="mb-4">
                <h3 className="mb-2 font-semibold">{category.name}</h3>
                {category.children.map((subCategory) => (
                  <div key={subCategory.id} className="mb-2 ml-4">
                    <Link
                      href={`/?categoryId=${subCategory.id}`}
                      className="text-sm text-gray-700 hover:text-orange-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {subCategory.name}
                    </Link>
                    {subCategory.children.length > 0 && (
                      <div className="ml-4 mt-1">
                        {subCategory.children.map((childCategory) => (
                          <Link
                            key={childCategory.id}
                            href={`/?categoryId=${childCategory.id}`}
                            className="block py-1 text-xs text-gray-600 hover:text-orange-600"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {childCategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">About Glamora</h3>
              <p className="text-sm text-gray-400">
                Your trusted fashion destination with the latest trends and
                styles.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Customer Service</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Account</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/dashboard/profile" className="hover:text-white">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-white">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-white">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@glamora.com</li>
                <li>Phone: +84 123 456 789</li>
                <li>Address: Ho Chi Minh City, Vietnam</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 Glamora Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
