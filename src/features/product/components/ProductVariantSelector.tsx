'use client';

import { Badge } from '@/components/ui/badge';
import type { ProductVariant } from '@/features/product/api/productApi';

interface ProductVariantSelectorProps {
  uniqueAttributes: Record<string, string[]>;
  selectedAttributes: Record<string, string>;
  onAttributeSelect: (attributeName: string, attributeValue: string) => void;
}

export default function ProductVariantSelector({
  uniqueAttributes,
  selectedAttributes,
  onAttributeSelect,
}: ProductVariantSelectorProps) {
  if (Object.keys(uniqueAttributes).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {Object.entries(uniqueAttributes).map(([attributeName, values]) => (
        <div key={attributeName}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
            {attributeName}
          </h3>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[attributeName] === value;
              return (
                <Badge
                  key={value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                  onClick={() => onAttributeSelect(attributeName, value)}
                >
                  {value}
                </Badge>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
