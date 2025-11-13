'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import AddressSelector from '@/features/address/components/AddressSelector';
import {
  ShippingAddressCard,
  OrderItemsCard,
  PaymentMethodCard,
  OrderNoteCard,
  OrderSummary,
} from '@/features/checkout/components';
import { useCheckout } from '@/features/checkout/hooks';

export default function CheckoutPage() {
  const {
    // State
    selectedAddressId,
    setSelectedAddressId,
    showAddressSelector,
    setShowAddressSelector,
    voucherCode,
    setVoucherCode,
    appliedVoucher,
    paymentMethod,
    setPaymentMethod,
    note,
    setNote,
    isProcessing,
    isCalculatingDiscount,

    // Data
    cart,
    selectedAddress,
    selectedItems,
    paymentMethods,

    // Computed
    subtotal,
    shippingFee,
    discountAmount,
    finalAmount,
    distance,

    // Handlers
    handleApplyVoucher,
    handleRemoveVoucher,
    handleCheckout,
  } = useCheckout();

  if (!cart) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/cart" className="hover:text-orange-600">
              Cart
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-orange-600">Checkout</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <ShippingAddressCard
              selectedAddress={selectedAddress || null}
              onChangeAddress={() => setShowAddressSelector(true)}
            />

            <OrderItemsCard items={selectedItems} />

            <PaymentMethodCard
              paymentMethod={paymentMethod}
              paymentMethods={paymentMethods}
              onPaymentMethodChange={setPaymentMethod}
            />

            <OrderNoteCard note={note} onNoteChange={setNote} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              subtotal={subtotal}
              shippingFee={shippingFee}
              discountAmount={discountAmount}
              finalAmount={finalAmount}
              distance={distance}
              paymentMethod={paymentMethod}
              isProcessing={isProcessing}
              canCheckout={!!selectedAddress}
              onCheckout={handleCheckout}
              voucherCode={voucherCode}
              appliedVoucher={appliedVoucher}
              isCalculating={isCalculatingDiscount}
              onVoucherCodeChange={setVoucherCode}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
            />
          </div>
        </div>

        {/* Address Selector Dialog */}
        {showAddressSelector && (
          <AddressSelector
            selectedId={selectedAddressId}
            onSelect={(id) => {
              setSelectedAddressId(id);
              setShowAddressSelector(false);
            }}
            onClose={() => setShowAddressSelector(false)}
          />
        )}
      </div>
    </div>
  );
}
