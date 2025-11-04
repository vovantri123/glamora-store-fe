'use client';

import React from 'react';
import { MapPin, Plus, Edit } from 'lucide-react';
import type { Address } from '@/features/address/api/addressApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ShippingAddressCardProps {
  selectedAddress: Address | null;
  onChangeAddress: () => void;
}

export default function ShippingAddressCard({
  selectedAddress,
  onChangeAddress,
}: ShippingAddressCardProps) {
  return (
    <Card className="border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-2 shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-transparent">
            Shipping Address
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedAddress ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-gray-900">
                    {selectedAddress.receiverName}
                  </p>
                  {selectedAddress.default && (
                    <Badge
                      variant="outline"
                      className="border-orange-200 bg-orange-50 text-xs text-orange-700"
                    >
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Phone:</span>
                  <span>{selectedAddress.receiverPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="font-medium">Address:</span>
                  <span className="flex-1">
                    {selectedAddress.streetDetail}, {selectedAddress.ward},{' '}
                    {selectedAddress.district}, {selectedAddress.province}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onChangeAddress}
                className="flex-shrink-0 gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
              >
                <Edit className="h-4 w-4" />
                Change
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-900">
              No shipping address
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Please add a delivery address to continue
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              onClick={onChangeAddress}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
