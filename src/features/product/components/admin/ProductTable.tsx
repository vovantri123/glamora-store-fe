import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Power,
  Package,
  Image as ImageIcon,
  Star,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Image from 'next/image';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  useDeleteProductMutation,
  useActivateProductMutation,
} from '@/features/product/api/productAdminApi';
import { Product } from '@/features/product/types/product-admin.types';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onManageVariants: (product: Product) => void;
  onManageImages: (product: Product) => void;
  onViewReviews: (product: Product) => void;
  isDeleted?: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onManageVariants,
  onManageImages,
  onViewReviews,
  isDeleted = false,
}: ProductTableProps) {
  const [deleteProduct] = useDeleteProductMutation();
  const [activateProduct] = useActivateProductMutation();
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    productId: number | null;
    action: 'delete' | 'activate';
  }>({ open: false, productId: null, action: 'delete' });

  const handleDelete = async () => {
    if (!confirmDialog.productId) return;

    try {
      const response = await deleteProduct(confirmDialog.productId).unwrap();
      toast.success(response.message || 'Product deleted successfully');
      setConfirmDialog({ open: false, productId: null, action: 'delete' });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(message);
    }
  };

  const handleActivate = async () => {
    if (!confirmDialog.productId) return;

    try {
      const response = await activateProduct(confirmDialog.productId).unwrap();
      toast.success(response.message || 'Product activated successfully');
      setConfirmDialog({ open: false, productId: null, action: 'activate' });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to activate product';
      toast.error(message);
    }
  };

  const openDeleteDialog = (productId: number) => {
    setConfirmDialog({ open: true, productId, action: 'delete' });
  };

  const openActivateDialog = (productId: number) => {
    setConfirmDialog({ open: true, productId, action: 'activate' });
  };

  const handleImageError = (productId: number) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px] text-center">ID</TableHead>
              <TableHead className="text-center">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-center font-medium">
                    {product.id}
                  </TableCell>
                  <TableCell>
                    {product.thumbnailUrl && !imageErrors.has(product.id) ? (
                      <div className="relative mx-auto h-24 w-24">
                        <Image
                          src={product.thumbnailUrl}
                          alt={product.name}
                          fill
                          sizes="96px"
                          className="rounded object-cover"
                          onError={() => handleImageError(product.id)}
                        />
                      </div>
                    ) : (
                      <div className="relative mx-auto h-24 w-24">
                        <Image
                          src="/placeholder.png"
                          alt="No image"
                          fill
                          sizes="96px"
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[300px]">
                      <div className="truncate font-medium">{product.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.categoryName}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isDeleted ? 'destructive' : 'default'}
                    >
                      {product.isDeleted ? 'Deleted' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(product.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onManageVariants(product)}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Manage Variants
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onManageImages(product)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Manage Images
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewReviews(product)}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          View Reviews
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isDeleted ? (
                          <DropdownMenuItem
                            onClick={() => openActivateDialog(product.id)}
                          >
                            <Power className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={
          confirmDialog.action === 'delete' ? handleDelete : handleActivate
        }
        title={
          confirmDialog.action === 'delete'
            ? 'Delete Product'
            : 'Activate Product'
        }
        description={
          confirmDialog.action === 'delete'
            ? 'Are you sure you want to delete this product? This action cannot be undone.'
            : 'Are you sure you want to activate this product?'
        }
        confirmText={confirmDialog.action === 'delete' ? 'Delete' : 'Activate'}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </>
  );
}
