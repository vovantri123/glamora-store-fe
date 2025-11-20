import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Power, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  useGetProductVariantsQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useActivateProductVariantMutation,
} from '../../api/productAdminApi';
import { useGetAttributesQuery } from '../../api/attributeApi';
import { Product, ProductVariant } from '../../types/product-admin.types';

interface ProductVariantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductVariantsDialog({
  open,
  onOpenChange,
  product,
}: ProductVariantsDialogProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );
  // Store selected attribute values as { attributeId: valueId }
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<
    Record<number, number>
  >({});
  const [selectedVariantIds, setSelectedVariantIds] = useState<number[]>([]);

  const { data: variantsData, isLoading } = useGetProductVariantsQuery(
    { productId: product?.id },
    { skip: !product }
  );

  const { data: attributesData } = useGetAttributesQuery();

  const [createVariant, { isLoading: isCreating }] =
    useCreateProductVariantMutation();
  const [updateVariant, { isLoading: isUpdating }] =
    useUpdateProductVariantMutation();
  const [deleteVariant] = useDeleteProductVariantMutation();
  const [activateVariant] = useActivateProductVariantMutation();

  const [formData, setFormData] = useState({
    sku: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    imageUrl: '',
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    variantId: number | null;
    action: 'delete' | 'activate';
  }>({ open: false, variantId: null, action: 'delete' });

  const variants = variantsData?.data?.content || [];
  const attributes = attributesData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Price is required and must be greater than 0');
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Stock is required and cannot be negative');
      return;
    }

    try {
      if (editingVariant) {
        const response = await updateVariant({
          variantId: editingVariant.id,
          data: {
            sku: formData.sku.trim() || undefined,
            price: parseFloat(formData.price),
            compareAtPrice: formData.compareAtPrice
              ? parseFloat(formData.compareAtPrice)
              : undefined,
            stock: parseInt(formData.stock),
            imageUrl: formData.imageUrl.trim() || undefined,
            attributeValueIds:
              Object.keys(selectedAttributeValues).length > 0
                ? Object.values(selectedAttributeValues)
                : undefined,
          },
        }).unwrap();
        toast.success(response.message || 'Variant updated successfully');
      } else {
        await createVariant({
          sku: formData.sku.trim() || undefined,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice
            ? parseFloat(formData.compareAtPrice)
            : undefined,
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl.trim() || undefined,
          productId: product.id,
          attributeValueIds:
            Object.keys(selectedAttributeValues).length > 0
              ? Object.values(selectedAttributeValues)
              : undefined,
        }).unwrap();
        toast.success('Variant created successfully');
      }
      resetForm();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save variant'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      price: '',
      compareAtPrice: '',
      stock: '',
      imageUrl: '',
    });
    setEditingVariant(null);
    setSelectedAttributeValues({});
    setShowForm(false);
  };

  const handleEdit = (variant: ProductVariant) => {
    setFormData({
      sku: variant.sku,
      price: variant.price.toString(),
      compareAtPrice: variant.compareAtPrice?.toString() || '',
      stock: variant.stock.toString(),
      imageUrl: variant.imageUrl || '',
    });
    // Convert variant values to attributeId -> valueId mapping
    const attributeValues: Record<number, number> = {};
    variant.variantValues.forEach((v) => {
      attributeValues[v.attributeId] = v.attributeValueId;
    });
    setSelectedAttributeValues(attributeValues);
    setEditingVariant(variant);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!confirmDialog.variantId) return;

    try {
      const response = await deleteVariant(confirmDialog.variantId).unwrap();
      toast.success(response.message || 'Variant deleted successfully');
      setConfirmDialog({ open: false, variantId: null, action: 'delete' });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete variant'
      );
    }
  };

  const handleActivate = async () => {
    if (!confirmDialog.variantId) return;

    try {
      const response = await activateVariant(confirmDialog.variantId).unwrap();
      toast.success(response.message || 'Variant activated successfully');
      setConfirmDialog({ open: false, variantId: null, action: 'activate' });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to activate variant'
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Variants - {product?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Variant
              </Button>
            )}

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border p-4"
              >
                <h3 className="font-semibold">
                  {editingVariant ? 'Edit Variant' : 'New Variant'}
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Auto-generated if empty"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="stock">
                      Stock <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">
                      Price <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="compareAtPrice">Compare At Price</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.compareAtPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compareAtPrice: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                    {formData.imageUrl && (
                      <div className="relative h-32 w-32 rounded border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-full w-full rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.className = 'hidden';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 sm:col-span-2">
                    <Label>Attributes (Optional)</Label>
                    <div className="space-y-3">
                      {attributes.map((attribute) => (
                        <div key={attribute.id} className="space-y-2">
                          <Label className="text-sm font-normal text-muted-foreground">
                            {attribute.name}
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {attribute.values.map((value) => {
                              const isSelected =
                                selectedAttributeValues[attribute.id] ===
                                value.id;
                              return (
                                <Button
                                  key={value.id}
                                  type="button"
                                  variant={isSelected ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAttributeValues((prev) => {
                                      const newValues = { ...prev };
                                      if (isSelected) {
                                        // Unselect current value
                                        delete newValues[attribute.id];
                                      } else {
                                        // Select new value (automatically replaces any existing selection for this attribute)
                                        newValues[attribute.id] = value.id;
                                      }
                                      return newValues;
                                    });
                                  }}
                                >
                                  {value.value}
                                  {isSelected && <X className="ml-1 h-3 w-3" />}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating
                      ? 'Saving...'
                      : editingVariant
                        ? 'Update Variant'
                        : 'Create Variant'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedVariantIds.length === variants.length &&
                          variants.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedVariantIds(variants.map((v) => v.id));
                          } else {
                            setSelectedVariantIds([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Attributes</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : variants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No variants found
                      </TableCell>
                    </TableRow>
                  ) : (
                    variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedVariantIds.includes(variant.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedVariantIds([
                                  ...selectedVariantIds,
                                  variant.id,
                                ]);
                              } else {
                                setSelectedVariantIds(
                                  selectedVariantIds.filter(
                                    (id) => id !== variant.id
                                  )
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {variant.imageUrl ? (
                            <div className="relative h-12 w-12">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={variant.imageUrl}
                                alt={variant.sku}
                                className="h-full w-full rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {variant.sku}
                        </TableCell>
                        <TableCell>
                          {variant.variantValues &&
                          variant.variantValues.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {variant.variantValues.map((attrValue) => (
                                <Badge
                                  key={attrValue.attributeValueId}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {attrValue.attributeName}:{' '}
                                  {attrValue.valueName}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No attributes
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>${variant.price.toFixed(2)}</div>
                            {variant.compareAtPrice && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${variant.compareAtPrice.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              variant.stock > 0 ? 'default' : 'destructive'
                            }
                          >
                            {variant.stock} units
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              variant.isDeleted ? 'destructive' : 'default'
                            }
                          >
                            {variant.isDeleted ? 'Deleted' : 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(variant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {variant.isDeleted ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    variantId: variant.id,
                                    action: 'activate',
                                  })
                                }
                              >
                                <Power className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    variantId: variant.id,
                                    action: 'delete',
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={
          confirmDialog.action === 'delete' ? handleDelete : handleActivate
        }
        title={
          confirmDialog.action === 'delete'
            ? 'Delete Variant'
            : 'Activate Variant'
        }
        description={
          confirmDialog.action === 'delete'
            ? 'Are you sure you want to delete this variant?'
            : 'Are you sure you want to activate this variant?'
        }
        confirmText={confirmDialog.action === 'delete' ? 'Delete' : 'Activate'}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </>
  );
}
