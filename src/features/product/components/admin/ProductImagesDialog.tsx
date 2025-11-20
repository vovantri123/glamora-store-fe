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
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Star, Edit, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  useGetProductImagesQuery,
  useCreateProductImageMutation,
  useUpdateProductImageMutation,
  useDeleteProductImageMutation,
  useSetProductImageAsThumbnailMutation,
} from '@/features/product/api/productAdminApi';
import {
  Product,
  ProductImage,
} from '@/features/product/types/product-admin.types';

interface ProductImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductImagesDialog({
  open,
  onOpenChange,
  product,
}: ProductImagesDialogProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const { data: imagesData, isLoading } = useGetProductImagesQuery(
    { productId: product?.id, sortBy: 'displayOrder', sortDir: 'asc' },
    { skip: !product }
  );

  const [createImage, { isLoading: isCreating }] =
    useCreateProductImageMutation();
  const [updateImage, { isLoading: isUpdating }] =
    useUpdateProductImageMutation();
  const [deleteImage] = useDeleteProductImageMutation();
  const [setAsThumbnail] = useSetProductImageAsThumbnailMutation();

  const [formData, setFormData] = useState({
    imageUrl: '',
    altText: '',
    isThumbnail: false,
    displayOrder: '',
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    imageId: number | null;
  }>({ open: false, imageId: null });

  const images = imagesData?.data?.content || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!formData.imageUrl.trim()) {
      toast.error('Image URL is required');
      return;
    }

    try {
      if (editingImage) {
        const response = await updateImage({
          imageId: editingImage.id,
          data: {
            imageUrl: formData.imageUrl.trim(),
            altText: formData.altText.trim() || undefined,
            displayOrder: formData.displayOrder
              ? parseInt(formData.displayOrder)
              : undefined,
          },
        }).unwrap();
        toast.success(response.message || 'Image updated successfully');
      } else {
        const response = await createImage({
          imageUrl: formData.imageUrl.trim(),
          altText: formData.altText.trim() || undefined,
          isThumbnail: formData.isThumbnail,
          displayOrder: formData.displayOrder
            ? parseInt(formData.displayOrder)
            : undefined,
          productId: product.id,
        }).unwrap();
        toast.success(response.message || 'Image added successfully');
      }
      resetForm();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : editingImage
            ? 'Failed to update image'
            : 'Failed to add image'
      );
    }
  };

  const handleEdit = (image: ProductImage) => {
    setEditingImage(image);
    setFormData({
      imageUrl: image.imageUrl,
      altText: image.altText || '',
      isThumbnail: image.isThumbnail,
      displayOrder: image.displayOrder.toString(),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      altText: '',
      isThumbnail: false,
      displayOrder: '',
    });
    setEditingImage(null);
    setShowForm(false);
  };

  const handleSetThumbnail = async (image: ProductImage) => {
    try {
      const response = await setAsThumbnail(image.id).unwrap();
      toast.success(response.message || 'Thumbnail updated successfully');
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to set as thumbnail'
      );
    }
  };

  const handleDelete = async () => {
    if (!confirmDialog.imageId) return;

    try {
      const response = await deleteImage(confirmDialog.imageId).unwrap();
      toast.success(response.message || 'Image deleted successfully');
      setConfirmDialog({ open: false, imageId: null });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete image'
      );
    }
  };

  const handleImageError = (imageId: number) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Images - {product?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!showForm && (
              <Button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Image
              </Button>
            )}

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border p-4"
              >
                <h3 className="font-semibold">
                  {editingImage ? 'Edit Image' : 'New Image'}
                </h3>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">
                      Image URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                    {formData.imageUrl && (
                      <div className="relative h-48 overflow-hidden rounded border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.className = 'hidden';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="altText">Alt Text</Label>
                    <Input
                      id="altText"
                      placeholder="Description for accessibility"
                      value={formData.altText}
                      onChange={(e) =>
                        setFormData({ ...formData, altText: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="displayOrder">Display Order</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.displayOrder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displayOrder: e.target.value,
                          })
                        }
                      />
                    </div>

                    {!editingImage && (
                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isThumbnail"
                            checked={formData.isThumbnail}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                isThumbnail: checked as boolean,
                              })
                            }
                          />
                          <Label
                            htmlFor="isThumbnail"
                            className="cursor-pointer font-normal"
                          >
                            Set as thumbnail
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating
                      ? editingImage
                        ? 'Updating...'
                        : 'Adding...'
                      : editingImage
                        ? 'Update Image'
                        : 'Add Image'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {isLoading ? (
                <div className="py-8 text-center">Loading...</div>
              ) : images.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No images found
                </div>
              ) : (
                images.map((image) => (
                  <div
                    key={image.id}
                    className="flex gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                      {image.imageUrl && !imageErrors.has(image.id) ? (
                        <Image
                          src={image.imageUrl}
                          alt={image.altText || 'Product image'}
                          fill
                          sizes="128px"
                          className="object-cover"
                          onError={() => handleImageError(image.id)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {image.isThumbnail && (
                        <Badge className="absolute left-2 top-2 bg-yellow-500 hover:bg-yellow-600">
                          <Star className="mr-1 h-3 w-3 fill-white" />
                          Thumbnail
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            {image.altText ? (
                              <p className="text-sm font-medium">
                                {image.altText}
                              </p>
                            ) : (
                              <p className="text-sm italic text-muted-foreground">
                                No alt text
                              </p>
                            )}
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {image.imageUrl}
                            </p>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0">
                            Order: {image.displayOrder}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          ID: {image.id}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(image)}
                            title="Edit image"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!image.isThumbnail && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSetThumbnail(image)}
                              title="Set as thumbnail"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                imageId: image.id,
                              })
                            }
                            title="Delete image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={handleDelete}
        title="Delete Image"
        description="Are you sure you want to delete this image?"
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
