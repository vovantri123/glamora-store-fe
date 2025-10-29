'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const wishlistItems = [
    { id: 1, name: 'Premium Leather Bag', price: '$199.99', image: '👜' },
    { id: 2, name: 'Designer Sunglasses', price: '$89.99', image: '🕶️' },
    { id: 3, name: 'Elegant Watch', price: '$299.99', image: '⌚' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <p className="mt-1 text-muted-foreground">
          Items you love and want to buy later
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <div className="flex justify-center rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 py-8 text-6xl dark:from-slate-900 dark:to-slate-800">
                {item.image}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="mt-1 text-xl font-bold text-foreground">
                  {item.price}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
