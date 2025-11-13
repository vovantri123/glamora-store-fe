'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import ProductCard from '@/features/product/components/ProductCard';
import { useGetProductsQuery } from '@/features/product/api/productApi';
import {
  useGetRootCategoriesQuery,
  Category,
} from '@/features/category/api/categoryApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { formatPrice } from '@/lib/utils';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: number | undefined;
  onCategoryChange: (id: number | undefined) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  formatPrice: (price: number) => string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  setPriceRange,
  formatPrice,
}) => (
  <div className="space-y-6">
    {/* Categories Filter */}
    <div>
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <Filter className="h-4 w-4" />
        Categories
      </h3>
      <div className="space-y-2">
        <Button
          variant={selectedCategory === undefined ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => onCategoryChange(undefined)}
        >
          All Products
        </Button>
        {categories.map((category) => (
          <div key={category.id} className="space-y-1">
            <Button
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
            {category.children?.map((subCat) => (
              <div key={subCat.id} className="ml-4 space-y-1">
                <Button
                  variant={selectedCategory === subCat.id ? 'default' : 'ghost'}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => onCategoryChange(subCat.id)}
                >
                  {subCat.name}
                </Button>
                {subCat.children?.map((childCat) => (
                  <Button
                    key={childCat.id}
                    variant={
                      selectedCategory === childCat.id ? 'default' : 'ghost'
                    }
                    size="sm"
                    className="ml-4 w-full justify-start text-xs"
                    onClick={() => onCategoryChange(childCat.id)}
                  >
                    {childCat.name}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Price Range Filter */}
    <div>
      <h3 className="mb-3 font-semibold">Price Range</h3>
      <div className="space-y-4">
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={3000000}
          step={50000}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
    </div>
  </div>
);

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [priceRange, setPriceRange] = useState([0, 3000000]);

  // Get params from URL - useMemo to avoid re-renders
  const keyword = useMemo(
    () => searchParams.get('keyword') || '',
    [searchParams]
  );
  const selectedCategory = useMemo(() => {
    const categoryIdParam = searchParams.get('categoryId');
    return categoryIdParam ? Number(categoryIdParam) : undefined;
  }, [searchParams]);

  // Handle category filter change
  const handleCategoryChange = (categoryId: number | undefined) => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (categoryId) params.set('categoryId', categoryId.toString());

    router.push(`/products${params.toString() ? '?' + params.toString() : ''}`);
  };

  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({
      page,
      size: 12,
      sortBy,
      sortDir,
      keyword: keyword || undefined,
      categoryId: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });

  const { data: categoriesData } = useGetRootCategoriesQuery();

  const products = productsData?.data?.content || [];
  const totalPages = productsData?.data?.totalPages || 0;
  const categories = categoriesData?.data || [];

  return (
    <div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <FilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  formatPrice={formatPrice}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {keyword ? `Search results for "${keyword}"` : 'All Products'}
              </h2>

              <div className="flex items-center gap-4">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        formatPrice={formatPrice}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select
                  value={`${sortBy},${sortDir}`}
                  onValueChange={(value) => {
                    const [newSortBy, newSortDir] = value.split(',');
                    setSortBy(newSortBy);
                    setSortDir(newSortDir);
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at,desc">Newest</SelectItem>
                    <SelectItem value="created_at,asc">Oldest</SelectItem>
                    <SelectItem value="name,asc">Name: A-Z</SelectItem>
                    <SelectItem value="name,desc">Name: Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {productsLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-64 w-full" />
                    <CardContent className="space-y-2 p-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!productsLoading && products.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
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

            {/* Empty State */}
            {!productsLoading && products.length === 0 && (
              <div className="py-20 text-center">
                <div className="mb-4 text-6xl">🛍️</div>
                <h3 className="mb-2 text-2xl font-semibold">
                  No products found
                </h3>
                <p className="mb-6 text-gray-500">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={() => {
                    setPriceRange([0, 3000000]);
                    router.push('/products');
                  }}
                >
                  Clear Filters
                </Button>
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
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
