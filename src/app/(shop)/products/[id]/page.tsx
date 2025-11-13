'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useGetProductByIdQuery } from '@/features/product/api/productApi';
import { ProductDetail } from '@/features/product/components';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);

  const { data: productData, isLoading } = useGetProductByIdQuery(productId);
  const product = productData?.data;

  if (isLoading) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
}
