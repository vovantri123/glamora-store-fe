'use client';

import { useState, useMemo, useCallback } from 'react';
import { debounce } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search } from 'lucide-react';
import { CustomPagination } from '@/components/common/CustomPagination';
import { useGetRootCategoriesQuery } from '@/features/category/api/categoryApi';
import { useGetProductsQuery } from '@/features/product/api/productAdminApi';
import { ProductTable } from '@/features/product/components/admin/ProductTable';
import { ProductFormDialog } from '@/features/product/components/admin/ProductFormDialog';
import { ProductVariantsDialog } from '@/features/product/components/admin/ProductVariantsDialog';
import { ProductImagesDialog } from '@/features/product/components/admin/ProductImagesDialog';
import { ProductReviewsDialog } from '@/features/product/components/admin/ProductReviewsDialog';
import { Product } from '@/features/product/types/product-admin.types';

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [isDeleted, setIsDeleted] = useState(false);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce<(value: string) => void>((value: string) => {
        setSearchTerm(value);
        setPage(0);
      }, 500),
    []
  );

  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchInput(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const [variantsDialog, setVariantsDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const [imagesDialog, setImagesDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const [reviewsDialog, setReviewsDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    size,
    sortBy,
    sortDir,
    keyword: searchTerm || undefined,
    categoryId: categoryId !== 'all' ? parseInt(categoryId) : undefined,
    isDeleted,
  });

  const { data: categoriesData } = useGetRootCategoriesQuery();

  const products = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const handleEdit = (product: Product) => {
    setFormDialog({ open: true, product });
  };

  const handleManageVariants = (product: Product) => {
    setVariantsDialog({ open: true, product });
  };

  const handleManageImages = (product: Product) => {
    setImagesDialog({ open: true, product });
  };

  const handleViewReviews = (product: Product) => {
    setReviewsDialog({ open: true, product });
  };

  const categories = categoriesData?.data || [];

  // Flatten categories tree
  const flattenCategories = (cats: any[], prefix = ''): any[] => {
    let result: any[] = [];
    cats.forEach((cat) => {
      result.push({ ...cat, displayName: prefix + cat.name });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, prefix + '  '));
      }
    });
    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage products, variants, images and reviews
          </p>
        </div>
        <Button onClick={() => setFormDialog({ open: true, product: null })}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by product name..."
                className="h-10 pl-9"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDeleted"
                  checked={isDeleted}
                  onCheckedChange={(checked) => {
                    setIsDeleted(!!checked);
                    setPage(0);
                  }}
                />
                <label
                  htmlFor="isDeleted"
                  className="cursor-pointer text-sm font-medium"
                >
                  Show deleted products
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Category:
                </span>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {flatCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Order:
                </span>
                <Select
                  value={sortDir}
                  onValueChange={(value) => setSortDir(value as 'asc' | 'desc')}
                >
                  <SelectTrigger className="h-9 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Show:
                </span>
                <Select
                  value={size.toString()}
                  onValueChange={(value) => {
                    setSize(Number(value));
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="h-9 w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading || isFetching ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onManageVariants={handleManageVariants}
                onManageImages={handleManageImages}
                onViewReviews={handleViewReviews}
                isDeleted={isDeleted}
              />
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        key={formDialog.product?.id || 'new'}
        open={formDialog.open}
        onOpenChange={(open) =>
          setFormDialog({ open, product: formDialog.product })
        }
        product={formDialog.product}
      />

      <ProductVariantsDialog
        open={variantsDialog.open}
        onOpenChange={(open) =>
          setVariantsDialog({ open, product: variantsDialog.product })
        }
        product={variantsDialog.product}
      />

      <ProductImagesDialog
        open={imagesDialog.open}
        onOpenChange={(open) =>
          setImagesDialog({ open, product: imagesDialog.product })
        }
        product={imagesDialog.product}
      />

      <ProductReviewsDialog
        open={reviewsDialog.open}
        onOpenChange={(open) =>
          setReviewsDialog({ open, product: reviewsDialog.product })
        }
        product={reviewsDialog.product}
      />
    </div>
  );
}
