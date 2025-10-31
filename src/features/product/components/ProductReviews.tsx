'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGetReviewStatsQuery, useGetReviewsQuery } from '../api/reviewApi';
import ReviewStats from './ReviewStats';
import ReviewList from './ReviewList';

interface ProductReviewsProps {
  productId: number;
  description: string;
}

export default function ProductReviews({
  productId,
  description,
}: ProductReviewsProps) {
  const { data: reviewStats } = useGetReviewStatsQuery(productId);
  const [selectedRating, setSelectedRating] = useState<number | undefined>();
  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsQuery({
    productId,
    rating: selectedRating,
  });

  const reviews = reviewsData?.data?.content || [];
  const stats = reviewStats?.data;

  return (
    <div className="mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({stats?.totalReviews || 0})
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-semibold">
                Product Description
              </h3>
              <div
                className="prose prose-orange max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          {/* Review Stats */}
          {stats &&
          stats.averageRating !== undefined &&
          stats.totalReviews > 0 ? (
            <ReviewStats stats={stats} />
          ) : (
            <Card className="mb-6">
              <CardContent className="p-6 text-center text-gray-500">
                No reviews yet. Be the first to review this product!
              </CardContent>
            </Card>
          )}

          {/* Filter Reviews */}
          {stats && stats.totalReviews > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={selectedRating === undefined ? 'default' : 'outline'}
                onClick={() => setSelectedRating(undefined)}
                size="sm"
              >
                All
              </Button>
              {[
                { rating: 5, count: stats.fiveStarCount },
                { rating: 4, count: stats.fourStarCount },
                { rating: 3, count: stats.threeStarCount },
                { rating: 2, count: stats.twoStarCount },
                { rating: 1, count: stats.oneStarCount },
              ].map(({ rating, count }) => {
                if (count === 0) return null;
                return (
                  <Button
                    key={rating}
                    variant={selectedRating === rating ? 'default' : 'outline'}
                    onClick={() => setSelectedRating(rating)}
                    size="sm"
                  >
                    {rating} <Star className="ml-1 h-3 w-3" /> ({count})
                  </Button>
                );
              })}
            </div>
          )}

          {/* Reviews List */}
          <ReviewList reviews={reviews} isLoading={reviewsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
