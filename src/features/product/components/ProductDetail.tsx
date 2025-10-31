'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Shield, RotateCcw } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ProductVariantSelector from './ProductVariantSelector';
import AddToCartSection from './AddToCartSection';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';
import { useGetCategoryPathQuery } from '@/features/category/api/categoryApi';
import type { Product } from '@/features/product/api/productApi';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { data: categoryPathData } = useGetCategoryPathQuery(
    product.categoryId,
    {
      skip: !product.categoryId,
    }
  );
  const categoryPath = categoryPathData?.data || [];

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  // Get unique attribute names and values
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

  // Find matching variant
  const findMatchingVariant = (attributes: Record<string, string>) => {
    return product.variants.find((variant) => {
      return Object.entries(attributes).every(([attrName, attrValue]) => {
        return variant.attributes.some(
          (attr) =>
            attr.attributeName === attrName && attr.attributeValue === attrValue
        );
      });
    });
  };

  // Handle attribute selection
  const handleAttributeSelect = (
    attributeName: string,
    attributeValue: string
  ) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeName]: attributeValue,
    };
    setSelectedAttributes(newSelectedAttributes);

    const matchingVariant = findMatchingVariant(newSelectedAttributes);
    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: 0,
            imageUrl: '/placeholder.png',
            altText: 'Product image',
            isThumbnail: true,
            displayOrder: 0,
          },
        ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="transition-colors hover:text-orange-600">
          Home
        </Link>
        {categoryPath.map((cat) => (
          <React.Fragment key={cat.id}>
            <span>/</span>
            <Link
              href={`/products?categoryId=${cat.id}`}
              className="transition-colors hover:text-orange-600"
            >
              {cat.name}
            </Link>
          </React.Fragment>
        ))}
        <span>/</span>
        <span className="font-medium text-gray-900">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <ProductImageGallery images={images} productName={product.name} />

        {/* Product Info */}
        <div className="space-y-6">
          <ProductInfo product={product} selectedVariant={selectedVariant} />

          {/* Variant Selection */}
          <ProductVariantSelector
            uniqueAttributes={uniqueAttributes}
            selectedAttributes={selectedAttributes}
            onAttributeSelect={handleAttributeSelect}
          />

          {/* Add to Cart */}
          <AddToCartSection selectedVariant={selectedVariant} />

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-gradient-to-br from-gray-50 to-orange-50 p-6">
            <div className="text-center">
              <Truck className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-600">Orders over $50</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-600">100% protected</p>
            </div>
            <div className="text-center">
              <RotateCcw className="mx-auto mb-2 h-8 w-8 text-orange-600" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600">Within 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <ProductReviews
        productId={product.id}
        description={product.description}
      />
    </div>
  );
}
