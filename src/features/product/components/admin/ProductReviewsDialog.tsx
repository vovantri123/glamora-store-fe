import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Power } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  useGetProductReviewsQuery,
  useDeleteProductReviewMutation,
  useActivateProductReviewMutation,
} from '@/features/product/api/productAdminApi';
import { Product } from '@/features/product/types/product-admin.types';

interface ProductReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductReviewsDialog({
  open,
  onOpenChange,
  product,
}: ProductReviewsDialogProps) {
  const { data: reviewsData, isLoading } = useGetProductReviewsQuery(
    { productId: product?.id },
    { skip: !product }
    // Khi bị skip thì không gọi API, isLoading sẽ là false luôn.
    // reviewsData = undefined -> reviews = [] do có fallback bên dưới
    // Sẽ hiển thị "No reviews found" thay vì "Loading..."
  );

  const [deleteReview] = useDeleteProductReviewMutation();
  const [activateReview] = useActivateProductReviewMutation();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    reviewId: number | null;
    action: 'delete' | 'activate';
  }>({ open: false, reviewId: null, action: 'delete' });

  const reviews = reviewsData?.data?.content || [];

  const handleDelete = async () => {
    if (!confirmDialog.reviewId) return;

    try {
      const response = await deleteReview(confirmDialog.reviewId).unwrap();
      toast.success(response.message || 'Review deleted successfully');
      setConfirmDialog({ open: false, reviewId: null, action: 'delete' });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete review'
      );
    }
  };

  const handleActivate = async () => {
    if (!confirmDialog.reviewId) return;

    try {
      const response = await activateReview(confirmDialog.reviewId).unwrap();
      toast.success(response.message || 'Review activated successfully');
      setConfirmDialog({ open: false, reviewId: null, action: 'activate' });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to activate review'
      );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Reviews - {product?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center">No reviews found</div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`rounded-lg border p-4 ${
                      review.isDeleted ? 'bg-muted/50 opacity-60' : ''
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="default" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                          {review.isDeleted && (
                            <Badge variant="destructive" className="text-xs">
                              Deleted
                            </Badge>
                          )}
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {review.isDeleted ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                reviewId: review.id,
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
                                reviewId: review.id,
                                action: 'delete',
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {review.comment && (
                      <p className="mb-2 text-sm text-foreground">
                        {review.comment}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {review.variantSku && (
                        <span>Variant: {review.variantSku}</span>
                      )}
                      <span>Order #{review.orderId}</span>
                      <span>By: {review.userEmail}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            ? 'Delete Review'
            : 'Activate Review'
        }
        description={
          confirmDialog.action === 'delete'
            ? 'Are you sure you want to delete this review? This action can be undone later.'
            : 'Are you sure you want to activate this review?'
        }
        confirmText={confirmDialog.action === 'delete' ? 'Delete' : 'Activate'}
        variant={confirmDialog.action === 'delete' ? 'destructive' : 'default'}
      />
    </>
  );
}
