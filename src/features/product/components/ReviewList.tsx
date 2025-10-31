'use client';

import React from 'react';
import { Star, User, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Review } from '@/features/product/api/reviewApi';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No reviews found for the selected filter.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.userAvatar} />
                <AvatarFallback className="bg-orange-100">
                  <User className="h-5 w-5 text-orange-600" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 font-semibold">{review.userFullName}</div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {review.isVerifiedPurchase && (
                    <Badge
                      variant="outline"
                      className="gap-1 text-xs text-green-600"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <p className="mb-2 text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
