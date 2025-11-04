'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateReviewMutation } from '../api/reviewApi';

interface CreateReviewDialogProps {
  productId: number;
  productName: string;
  selectedVariantId: number | null;
  trigger?: React.ReactNode;
}

export default function CreateReviewDialog({
  productId,
  productName,
  selectedVariantId,
  trigger,
}: CreateReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét');
      return;
    }

    if (!selectedVariantId) {
      toast.error(
        'Vui lòng chọn phân loại sản phẩm (màu sắc, size) trước khi đánh giá'
      );
      return;
    }

    try {
      await createReview({
        productId,
        variantId: selectedVariantId,
        rating,
        comment: comment.trim(),
      }).unwrap();

      toast.success('Đánh giá thành công!');
      setOpen(false);
      setRating(5);
      setComment('');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Không thể tạo đánh giá');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-orange-600 to-orange-700">
            Viết đánh giá
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đánh giá sản phẩm</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <Label>Đánh giá của bạn</Label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-semibold">{rating} sao</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Nhận xét của bạn</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={5}
              className="mt-2"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-600 to-orange-700"
            >
              {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
