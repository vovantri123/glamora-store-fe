'use client';

import React from 'react';
import Image from 'next/image';
import {
  CreditCard,
  Truck,
  AlertCircle,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { PaymentMethod } from '@/features/payment/api/paymentApi';

interface PaymentMethodCardProps {
  paymentMethod: string;
  paymentMethods: PaymentMethod[];
  onPaymentMethodChange: (method: string) => void;
}

export default function PaymentMethodCard({
  paymentMethod,
  paymentMethods,
  onPaymentMethodChange,
}: PaymentMethodCardProps) {
  const getPaymentMethodIcon = (name: string) => {
    if (name.toLowerCase().includes('cod')) {
      return <Truck className="h-6 w-6" />;
    }
    if (
      name.toLowerCase().includes('vnpay') ||
      name.toLowerCase().includes('online')
    ) {
      return <Smartphone className="h-6 w-6" />;
    }
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <Card className="overflow-hidden border-orange-100 shadow-sm">
      <CardHeader className="border-b border-orange-50 bg-gradient-to-r from-orange-50/50 to-transparent">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
            <CreditCard className="h-4 w-4 text-orange-600" />
          </div>
          Phương thức thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative mb-4 cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                paymentMethod === method.name
                  ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
              onClick={() => onPaymentMethodChange(method.name)}
            >
              <div className="flex items-center space-x-4 p-5">
                <div
                  className={`rounded-full p-3 transition-all duration-300 ${
                    paymentMethod === method.name
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg'
                      : 'bg-gray-100'
                  }`}
                >
                  {React.cloneElement(getPaymentMethodIcon(method.name), {
                    className: `transition-colors duration-300 ${
                      paymentMethod === method.name
                        ? 'text-white'
                        : 'text-gray-600'
                    }`,
                  })}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <Label
                      htmlFor={method.name}
                      className="cursor-pointer text-lg font-bold text-gray-900"
                    >
                      {method.name}
                    </Label>
                    {paymentMethod === method.name && (
                      <CheckCircle2 className="h-5 w-5 text-orange-600 duration-300 animate-in fade-in" />
                    )}
                  </div>
                  <p className="mb-2 text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>

                <RadioGroupItem
                  value={method.name}
                  id={method.name}
                  className="border-2 border-gray-300 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
