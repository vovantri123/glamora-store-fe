// Re-export types from API to avoid duplication
export type { Order, OrderItem, OrdersParams } from '../api/orderApi';

// Additional type definitions that are not in the API
export interface OrderAddress {
  recipientName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface CreateOrderRequest {
  shippingAddress: OrderAddress;
  paymentMethod: 'COD' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  note?: string;
}
