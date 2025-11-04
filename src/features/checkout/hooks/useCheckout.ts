'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
  removeSelectedItems,
  selectAllItems,
} from '@/features/cart/store/cartSlice';
import { useGetCartQuery } from '@/features/cart/api/cartApi';
import { baseApi } from '@/lib/api/baseApi';
import {
  useGetAllMyAddressesQuery,
  useGetDefaultAddressQuery,
} from '@/features/address/api/addressApi';
import { useApplyVoucherDirectlyMutation } from '@/features/voucher/api/voucherApi';
import { useCreateOrderMutation } from '@/features/order/api/orderApi';
import {
  useCreatePaymentMutation,
  useGetAllPaymentMethodsQuery,
} from '@/features/payment/api/paymentApi';

export function useCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedItemIds = useAppSelector((state) => state.cart.selectedItemIds);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    voucherId?: number;
    discountAmount: number;
  } | null>(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartData } = useGetCartQuery();
  const { data: defaultAddressData } = useGetDefaultAddressQuery();
  const { data: addressesData } = useGetAllMyAddressesQuery();
  const { data: paymentMethodsData } = useGetAllPaymentMethodsQuery();

  const [applyVoucher, { isLoading: isCalculatingDiscount }] =
    useApplyVoucherDirectlyMutation();
  const [createOrder] = useCreateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();

  const cart = cartData?.data;
  const addresses = useMemo(
    () => addressesData?.data || [],
    [addressesData?.data]
  );
  const paymentMethods = useMemo(
    () => paymentMethodsData?.data || [],
    [paymentMethodsData?.data]
  );
  const [paymentMethod, setPaymentMethod] = useState<string>(() => {
    if (paymentMethods.length > 0) {
      return (
        paymentMethods.find((pm) => pm.name.toLowerCase().includes('cod'))
          ?.name || paymentMethods[0].name
      );
    }
    return '';
  });
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  // Get only selected cart items for checkout
  const selectedItems = useMemo(() => {
    if (!cart) return [];
    return cart.items.filter((item) => selectedItemIds.includes(item.id));
  }, [cart, selectedItemIds]);

  // Calculate distance from store to selected address
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const STORE_LAT = 10.850769;
  const STORE_LNG = 106.771848;

  const distance =
    selectedAddress?.latitude && selectedAddress?.longitude
      ? calculateDistance(
          STORE_LAT,
          STORE_LNG,
          selectedAddress.latitude,
          selectedAddress.longitude
        )
      : undefined;

  // Set default address when addresses are loaded
  useEffect(() => {
    if (
      addresses.length > 0 &&
      selectedAddressId === null &&
      defaultAddressData?.data
    ) {
      // eslint-disable-next-line
      setSelectedAddressId(defaultAddressData.data.id);
    }
  }, [addresses, selectedAddressId, defaultAddressData]);

  // Set default payment method when payment methods are loaded
  useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      const defaultMethod =
        paymentMethods.find((pm) => pm.name.toLowerCase().includes('cod'))
          ?.name || paymentMethods[0].name;
      // eslint-disable-next-line
      setPaymentMethod(defaultMethod); // This is acceptable for setting default values from async data
    }
  }, [paymentMethods, paymentMethod]);

  // Auto-select all items for checkout if none are selected (only on initial load)
  useEffect(() => {
    if (
      cart &&
      cart.items.length > 0 &&
      selectedItemIds.length === 0 &&
      !isProcessing
    ) {
      // Auto-select all items for checkout
      dispatch(selectAllItems());
    }
  }, [cart, selectedItemIds.length, dispatch, isProcessing]);

  // Redirect if cart is empty (no items at all), not if no items selected
  // Only redirect if not currently processing checkout
  useEffect(() => {
    if (cart && cart.items.length === 0 && !isProcessing) {
      toast.error('Cart is empty');
      router.push('/cart');
    }
  }, [cart, router, isProcessing]);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  // Shipping fee: 2000 VND per km (backend will calculate actual fee)
  // This is just for preview/estimation
  const shippingFee = distance ? distance * 2000 : 0;
  const discountAmount = appliedVoucher?.discountAmount || 0;
  const finalAmount = subtotal + shippingFee - discountAmount;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Please enter voucher code');
      return;
    }

    try {
      const result = await applyVoucher({
        voucherCode: voucherCode.trim(),
        orderAmount: subtotal,
      }).unwrap();

      if (result?.data?.discountAmount !== undefined) {
        setAppliedVoucher({
          code: voucherCode.trim(),
          voucherId: result.data.voucherId,
          discountAmount: result.data.discountAmount,
        });
        toast.success('Voucher applied successfully!');
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Invalid voucher code');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Please select shipping address');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please select items to checkout');
      return;
    }

    setIsProcessing(true);

    try {
      // Map selected cart items to order items
      const orderItems = selectedItems.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      // Step 1: Create order (with voucher if applied)
      const selectedPaymentMethod = paymentMethods.find(
        (pm) => pm.name === paymentMethod
      );

      if (!selectedPaymentMethod) {
        toast.error('Payment method not found');
        setIsProcessing(false);
        return;
      }

      const orderResult = await createOrder({
        addressId: selectedAddress.id,
        paymentMethodId: selectedPaymentMethod.id,
        note: note || undefined,
        items: orderItems,
        voucherId: appliedVoucher?.voucherId, // Send voucher ID if applied
        discountAmount: appliedVoucher?.discountAmount, // Send discount amount if applied
      }).unwrap();

      if (!orderResult?.data?.id) {
        toast.error('Cannot create order');
        setIsProcessing(false);
        return;
      }

      const order = orderResult.data;
      // toast.success('Order placed successfully!'); // Removed to avoid duplicate toast

      // Step 2: Handle payment based on method
      if (paymentMethod === 'COD') {
        // Create COD payment
        try {
          await createPayment({
            orderId: order.id,
            paymentMethodId: selectedPaymentMethod.id,
          }).unwrap();

          // Remove selected items from cart (backend already removed them)
          dispatch(removeSelectedItems());

          // Invalidate cart cache to refresh cart data immediately
          dispatch(baseApi.util.invalidateTags(['Cart']));

          // Redirect to orders page with success message
          router.push(`/orders?success=true&orderCode=${order.orderCode}`);
        } catch (paymentError: unknown) {
          const payErr = paymentError as { data?: { message?: string } };
          console.error('COD payment error:', paymentError);
          toast.error(
            payErr?.data?.message ||
              'Error creating COD payment. Please try again later.'
          );
          router.push(`/orders/${order.id}`);
        }
      } else {
        try {
          const paymentResult = await createPayment({
            orderId: order.id,
            paymentMethodId: selectedPaymentMethod.id,
          }).unwrap();

          console.log('Payment result:', paymentResult);

          if (paymentResult?.data?.payUrl) {
            window.location.href = paymentResult.data.payUrl;
          } else {
            console.error('No payment URL in response:', paymentResult);
            toast.error('No VNPay payment URL received');
            router.push(`/orders/${order.id}`);
          }
        } catch (paymentError: unknown) {
          const payErr = paymentError as { data?: { message?: string } };
          console.error('Payment error:', paymentError);
          toast.error(
            payErr?.data?.message ||
              'Error creating VNPay payment. Please try again later.'
          );
          // Still redirect to order page so user can see their order
          router.push(`/orders/${order.id}`);
        }
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      console.error('Checkout error:', err);
      toast.error(
        err?.data?.message || 'An error occurred while placing the order'
      );
      setIsProcessing(false);
    }
  };

  return {
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
    addresses,
    paymentMethods,
    selectedAddress,
    selectedItems,

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
  };
}
