import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/features/product/api/productAdminApi';
import { useGetRootCategoriesQuery } from '@/features/category/api/categoryApi';
import { Product } from '@/features/product/types/product-admin.types';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const isEditMode = !!product;

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categoriesData } = useGetRootCategoriesQuery();

  const getInitialFormData = useCallback(() => {
    if (product) {
      return {
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId.toString(),
      };
    }
    return {
      name: '',
      description: '',
      categoryId: '',
    };
  }, [product]);

  const [formData, setFormData] = useState(getInitialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.categoryId) {
      toast.error('Category is required');
      return;
    }

    try {
      if (isEditMode) {
        await updateProduct({
          productId: product.id,
          data: {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            categoryId: parseInt(formData.categoryId),
          },
        }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProduct({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          categoryId: parseInt(formData.categoryId),
        }).unwrap();
        toast.success('Product created successfully');
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? 'update' : 'create'} product`;
      toast.error(message);
    }
  };

  const categories = categoriesData?.data || [];

  // Flatten categories tree to list
  interface CategoryItem {
    id: number;
    name: string;
    children?: CategoryItem[];
    displayName?: string;
  }

  const flattenCategories = (
    cats: CategoryItem[],
    prefix = ''
  ): CategoryItem[] => {
    let result: CategoryItem[] = [];
    cats.forEach((cat) => {
      // Only include leaf categories (categories with no children)
      if (!cat.children || cat.children.length === 0) {
        result.push({ ...cat, displayName: prefix + cat.name });
      }
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, prefix + '  '));
      }
    });
    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                maxLength={255}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[400px] overflow-y-auto">
                  {flatCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/5000 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? 'Saving...'
                : isEditMode
                  ? 'Update Product'
                  : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
