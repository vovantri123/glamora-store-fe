import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, getLowestPrice } from '@/lib/utils';
import type { ProductVariant } from '@/features/product/api/productApi';

interface ProductCardProps {
  id: number;
  name: string;
  categoryName: string;
  images: Array<{ imageUrl: string; altText?: string }>;
  variants: ProductVariant[];
  averageRating?: number;
  totalReviews?: number;
}

export default function ProductCard({
  id,
  name,
  categoryName,
  images,
  variants,
  averageRating,
  totalReviews,
}: ProductCardProps) {
  const lowestPrice = getLowestPrice(variants);
  const mainImage = images?.[0]?.imageUrl || '/placeholder.png';
  const hasDiscount = variants[0]?.compareAtPrice;
  const hasRating = averageRating && averageRating > 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={mainImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {hasDiscount && (
            <Badge className="absolute left-2 top-2 bg-red-500">Sale</Badge>
          )}
        </div>
        <CardContent className="space-y-3 p-4">
          <div>
            <p className="mb-1 text-xs text-gray-500">{categoryName}</p>
            <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-orange-600">
              {name}
            </h3>
          </div>

          {hasRating && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                ({totalReviews} reviews)
              </span>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(lowestPrice)}
              </p>
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(hasDiscount)}
                </p>
              )}
            </div>
            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-gradient-to-r from-orange-600 to-red-600 shadow-md transition-shadow hover:shadow-lg"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
