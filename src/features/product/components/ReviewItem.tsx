'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Review } from '../api/reviewApi';

interface ReviewItemProps {
  review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* User Info */}
        <div className="mb-4 flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userAvatar} alt={review.userFullName} />
            <AvatarFallback>{getInitials(review.userFullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{review.userFullName}</h4>
              {review.isVerifiedPurchase && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Đã mua hàng
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              {/* Rating Stars */}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Comment */}
        <p className="whitespace-pre-wrap text-gray-700">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
