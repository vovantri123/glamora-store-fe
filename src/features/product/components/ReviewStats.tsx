'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ReviewStats as ReviewStatsType } from '@/features/product/api/reviewApi';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Rating Summary */}
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-orange-600">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="mb-2 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(stats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {stats.totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[
              { rating: 5, count: stats.fiveStarCount },
              { rating: 4, count: stats.fourStarCount },
              { rating: 3, count: stats.threeStarCount },
              { rating: 2, count: stats.twoStarCount },
              { rating: 1, count: stats.oneStarCount },
            ].map(({ rating, count }) => {
              const percentage =
                stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-12 text-sm">{rating} star</span>
                  <Progress value={percentage} className="flex-1" />
                  <span className="w-12 text-right text-sm text-gray-600">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
