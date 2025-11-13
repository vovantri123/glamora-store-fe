'use client';

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Shield, Truck, Award, ChevronRight } from 'lucide-react';

import ProductCard from '@/features/product/components/ProductCard';
import { useGetProductsQuery } from '@/features/product/api/productApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  // Fetch featured products (newest 8 products)
  const { data: featuredData, isLoading } = useGetProductsQuery({
    page: 0,
    size: 8,
    sortBy: 'created_at',
    sortDir: 'desc',
  });

  const featuredProducts = featuredData?.data?.content || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                ✨ New Collection 2025
              </Badge>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-6xl">
                Elevate Your Style with{' '}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Glamora
                </span>
              </h1>
              <p className="text-lg text-gray-600 lg:text-xl">
                Discover the latest fashion trends and timeless classics.
                Premium quality meets affordable luxury.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    Shop Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                  alt="Fashion Model"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-orange-500 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-red-500 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over 500K</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  100% secure transactions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Quality</h3>
                <p className="text-sm text-gray-600">Guaranteed satisfaction</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Latest Trends</h3>
                <p className="text-sm text-gray-600">Always up to date</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
              Featured Collection
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              Trending Now
            </h2>
            <p className="text-gray-600">
              Explore our most popular products loved by our customers
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square animate-pulse bg-gray-200" />
                  <CardContent className="space-y-2 p-4">
                    <div className="h-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  categoryName={product.categoryName}
                  images={product.images}
                  variants={product.variants}
                  averageRating={product.averageRating}
                  totalReviews={product.totalReviews}
                />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden rounded-2xl lg:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800"
                alt="About Glamora"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                About Us
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                Your Fashion Destination Since 2020
              </h2>
              <p className="text-gray-600">
                At Glamora, we believe that fashion is more than just
                clothing—it&apos;s a form of self-expression. We curate the
                finest collections from around the world to bring you styles
                that inspire confidence and celebrate individuality.
              </p>
              <p className="text-gray-600">
                Our commitment to quality, sustainability, and exceptional
                customer service has made us a trusted name in fashion retail.
                Join thousands of satisfied customers who have made Glamora
                their go-to fashion destination.
              </p>
              <Link href="/about">
                <Button
                  size="lg"
                  className="mt-4 bg-gradient-to-r from-orange-600 to-red-600"
                >
                  Learn More About Us
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Ready to Upgrade Your Wardrobe?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Join our community and get exclusive access to new arrivals and
            special offers
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                Start Shopping
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange-600"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
