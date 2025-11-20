// Product Admin Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  thumbnailUrl?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  categoryId: number;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  categoryId?: number;
}

export interface ProductsParams {
  categoryId?: number;
  keyword?: string;
  isDeleted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Product Variant Types
export interface AttributeValueInfo {
  attributeValueId: number;
  attributeId: number;
  attributeName: string;
  valueName: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl?: string;
  isDeleted: boolean;
  productId: number;
  productName: string;
  variantValues: AttributeValueInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantCreateRequest {
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl?: string;
  productId: number;
  attributeValueIds?: number[];
}

export interface ProductVariantUpdateRequest {
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  imageUrl?: string;
  attributeValueIds?: number[];
}

export interface ProductVariantsParams {
  productId?: number;
  keyword?: string;
  isDeleted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Product Image Types
export interface ProductImage {
  id: number;
  imageUrl: string;
  altText?: string;
  isThumbnail: boolean;
  displayOrder: number;
  productId: number;
  productName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageCreateRequest {
  imageUrl: string;
  altText?: string;
  isThumbnail?: boolean;
  displayOrder?: number;
  productId: number;
}

export interface ProductImageUpdateRequest {
  imageUrl?: string;
  altText?: string;
  isThumbnail?: boolean;
  displayOrder?: number;
}

export interface ProductImagesParams {
  productId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Product Review Types
export interface ProductReview {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  productId: number;
  productName: string;
  variantId?: number;
  variantSku?: string;
  orderId: number;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductReviewUpdateRequest {
  rating?: number;
  comment?: string;
}

export interface ProductReviewsParams {
  productId?: number;
  userId?: number;
  rating?: number;
  isDeleted?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
