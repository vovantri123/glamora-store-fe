'use client';

import { Badge } from '@/components/ui/badge';
import type { Product } from '@/features/product/api/productApi';

interface ProductVariantSelectorProps {
  product: Product;
}

export default function ProductVariantSelector({
  product,
}: ProductVariantSelectorProps) {
  // Get unique attribute names and their values from all variants
  const getUniqueAttributes = () => {
    const attributesMap: Record<string, Set<string>> = {};

    product.variants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!attributesMap[attr.attributeName]) {
          attributesMap[attr.attributeName] = new Set();
        }
        attributesMap[attr.attributeName].add(attr.attributeValue);
      });
    });

    return Object.entries(attributesMap).reduce(
      (acc, [name, values]) => {
        acc[name] = Array.from(values);
        return acc;
      },
      {} as Record<string, string[]>
    );
  };

  const uniqueAttributes = getUniqueAttributes();

  if (Object.keys(uniqueAttributes).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
        Available Options
      </h3>
      {Object.entries(uniqueAttributes).map(([attributeName, values]) => (
        <div key={attributeName}>
          <p className="mb-2 text-sm font-medium text-gray-600">
            {attributeName}:
          </p>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <Badge
                key={value}
                variant="outline"
                className="border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700"
              >
                {value}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
