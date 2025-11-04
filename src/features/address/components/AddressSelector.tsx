'use client';

import React, { useState } from 'react';
import { MapPin, Plus, CheckCircle2, Trash2, Star, Edit } from 'lucide-react';
import {
  useGetAllMyAddressesQuery,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} from '../api/addressApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import AddressForm from './AddressForm';

interface AddressSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export default function AddressSelector({
  selectedId,
  onSelect,
  onClose,
}: AddressSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [tempSelectedId, setTempSelectedId] = useState<number | null>(
    selectedId
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: addressesData, isLoading } = useGetAllMyAddressesQuery();
  const [setDefaultAddress, { isLoading: isSettingDefault }] =
    useSetDefaultAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const addresses = addressesData?.data || [];

  const handleConfirm = () => {
    if (tempSelectedId) {
      onSelect(tempSelectedId);
      onClose();
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await setDefaultAddress(addressId).unwrap();
      // Tự động chọn địa chỉ này khi set default
      setTempSelectedId(addressId);
      toast.success('Default address updated successfully!');
    } catch (error) {
      console.error('Failed to set default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteAddress(addressId).unwrap();
      toast.success('Address deleted successfully!');

      if (tempSelectedId === addressId) {
        setTempSelectedId(null);
      }

      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    }
  };

  if (showAddForm) {
    return (
      <AddressForm
        onSuccess={(newAddress) => {
          setShowAddForm(false);
          setTempSelectedId(newAddress.id);
        }}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (editingAddress !== null) {
    const addressToEdit = addresses.find((a) => a.id === editingAddress);
    return (
      <AddressForm
        address={addressToEdit}
        onSuccess={(updatedAddress) => {
          setEditingAddress(null);
          setTempSelectedId(updatedAddress.id);
        }}
        onCancel={() => setEditingAddress(null)}
      />
    );
  }

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              Select delivery address
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading addresses...
                </p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <MapPin className="h-10 w-10 text-gray-400" />
                </div>
                <p className="mt-4 font-medium text-gray-900">
                  No addresses yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first delivery address
                </p>
                <Button
                  className="mt-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new address
                </Button>
              </div>
            ) : (
              <>
                <RadioGroup
                  value={tempSelectedId?.toString()}
                  onValueChange={(value) => setTempSelectedId(Number(value))}
                >
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <Card
                        key={address.id}
                        className={`cursor-pointer transition-all ${
                          tempSelectedId === address.id
                            ? 'border-orange-600 bg-orange-50 shadow-md ring-2 ring-orange-200'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => setTempSelectedId(address.id)}
                      >
                        <CardContent className="p-5">
                          <div className="flex gap-4">
                            {/* Radio button - Fixed position */}
                            <div className="flex-shrink-0 pt-1">
                              <RadioGroupItem
                                value={address.id.toString()}
                                id={`address-${address.id}`}
                              />
                            </div>

                            {/* Address content - Flexible */}
                            <Label
                              htmlFor={`address-${address.id}`}
                              className="flex-1 cursor-pointer"
                              onClick={() => setTempSelectedId(address.id)}
                            >
                              <div className="space-y-2">
                                {/* Name and Phone on same line */}
                                <span className="text-base font-semibold text-gray-900">
                                  {address.receiverName}
                                </span>

                                {/* Phone */}
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="whitespace-nowrap font-medium">
                                    Phone:
                                  </span>
                                  <span>{address.receiverPhone}</span>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="whitespace-nowrap font-medium">
                                    Address:
                                  </span>
                                  <span className="break-words">
                                    {address.streetDetail}, {address.ward},{' '}
                                    {address.district}, {address.province}
                                  </span>
                                </div>
                              </div>
                            </Label>

                            {/* Checkmark - Fixed position */}
                            {/* Set as default button in top right corner */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 gap-1 px-2 text-xs ${
                                address.default
                                  ? 'cursor-not-allowed text-orange-500'
                                  : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!address.default) {
                                  handleSetDefault(address.id);
                                }
                              }}
                              disabled={isSettingDefault || address.default}
                              title={
                                address.default
                                  ? 'This is already the default address'
                                  : 'Set as default address'
                              }
                            >
                              <Star
                                className={`h-3 w-3 ${address.default ? 'fill-orange-500' : ''}`}
                              />
                            </Button>
                          </div>

                          {/* Action buttons - Compact layout */}
                          <div className="mt-3 flex items-center gap-1 pl-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAddress(address.id);
                              }}
                              title="Edit address"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(address.id);
                              }}
                              disabled={isDeleting}
                              title="Delete address"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>

                <Button
                  variant="outline"
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add new address
                </Button>

                <div className="flex gap-3 border-t pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    onClick={handleConfirm}
                    disabled={!tempSelectedId}
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete address?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() =>
                deleteConfirmId && handleDeleteAddress(deleteConfirmId)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
