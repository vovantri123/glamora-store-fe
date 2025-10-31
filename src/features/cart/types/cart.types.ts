export interface CartItemAttribute {
  attributeId: number;
  attributeName: string;
  valueId: number;
  valueName: string;
}

export interface CartItemVariant {
  id: number;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl?: string;
  product: {
    id: number;
    name: string;
  };
  attributes: CartItemAttribute[];
}

export interface CartItem {
  id: number;
  variant: CartItemVariant;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean; // For cart drawer/modal
}
