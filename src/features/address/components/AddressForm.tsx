'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from '../api/addressApi';
import type { Address } from '../api/addressApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import InteractiveMapInline from './InteractiveMapInline';

interface AddressFormProps {
  address?: Address | null;
  onSuccess: (address: Address) => void;
  onCancel: () => void;
}

export default function AddressForm({
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    receiverName: address?.receiverName || '',
    receiverPhone: address?.receiverPhone || '',
    streetDetail: address?.streetDetail || '',
    ward: address?.ward || '',
    district: address?.district || '',
    province: address?.province || '',
    latitude: address?.latitude,
    longitude: address?.longitude,
    default: address?.default || false,
  });

  const [distance, setDistance] = useState<number | null>(null);
  const [showInlineMap, setShowInlineMap] = useState(true); // Always show map by default
  const [geocodedLocation, setGeocodedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fixed location: Glamora Store (ví dụ: SPKT)
  const STORE_LAT = 10.850769;
  const STORE_LNG = 106.771848;

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const isLoading = isCreating || isUpdating;

  // Sync geocoded location to form data
  useEffect(() => {
    if (geocodedLocation) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        latitude: geocodedLocation.lat,
        longitude: geocodedLocation.lng,
      }));
      setGeocodedLocation(null); // Reset after sync
    }
  }, [geocodedLocation]);

  // Geocode address function
  const handleGeocodeAddress = async () => {
    const addressQuery = `${formData.district}, ${formData.province}`.replace(
      /^, |, $/,
      ''
    );

    if (!addressQuery || !addressQuery.trim()) {
      toast.error('Please enter district and province first');
      return;
    }

    try {
      toast.info('Searching for location...');

      // Use Nominatim API for geocoding
      const query = encodeURIComponent(addressQuery.trim() + ', Vietnam');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=VN`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Set geocoded location - this will trigger useEffect to update formData
        setGeocodedLocation({ lat, lng });

        // Calculate distance
        const dist = calculateDistance(lat, lng, STORE_LAT, STORE_LNG);
        setDistance(dist);

        toast.success(`Location found: ${result.display_name}`);
      } else {
        toast.error(
          'No location found for this address. Try being more specific.'
        );
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to find location. Please try again.');
    }
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if latitude and longitude are provided
    if (!formData.latitude || !formData.longitude) {
      toast.error(
        'Please select location on the map or enter coordinates manually!'
      );
      return;
    }

    try {
      let result;
      if (address) {
        // Update existing address - map default to default for API compatibility
        const updateData = {
          receiverName: formData.receiverName,
          receiverPhone: formData.receiverPhone,
          streetDetail: formData.streetDetail,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          latitude: formData.latitude,
          longitude: formData.longitude,
          default: formData.default, // Backend expects "default" field
        };
        result = await updateAddress({
          id: address.id,
          data: updateData,
        }).unwrap();
      } else {
        // Create new address - map default to default for API compatibility
        const createData = {
          receiverName: formData.receiverName,
          receiverPhone: formData.receiverPhone,
          streetDetail: formData.streetDetail,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          latitude: formData.latitude,
          longitude: formData.longitude,
          default: formData.default, // Backend expects "default" field
        };
        result = await createAddress(createData).unwrap();
      }

      if (result?.data) {
        toast.success(
          address
            ? 'Address updated successfully!'
            : 'Address added successfully!'
        );
        onSuccess(result.data);
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || `Cannot ${address ? 'update' : 'add'} address`
      );
    }
  };
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Edit address' : 'Add new address'}
          </DialogTitle>
          <DialogDescription>
            Fill in the delivery address details. You can use auto-geocoding or
            select location on interactive map. Use &quot;Find Address&quot;
            button to locate your address automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="receiverName">
                Full name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="receiverName"
                value={formData.receiverName}
                onChange={(e) =>
                  setFormData({ ...formData, receiverName: e.target.value })
                }
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverPhone">
                Phone number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="receiverPhone"
                type="tel"
                value={formData.receiverPhone}
                onChange={(e) =>
                  setFormData({ ...formData, receiverPhone: e.target.value })
                }
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetDetail">
              Specific address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="streetDetail"
              value={formData.streetDetail}
              onChange={(e) =>
                setFormData({ ...formData, streetDetail: e.target.value })
              }
              required
              placeholder="House number, street name..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ward">
                Ward/Commune <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ward"
                value={formData.ward}
                onChange={(e) =>
                  setFormData({ ...formData, ward: e.target.value })
                }
                required
                placeholder="Enter ward/commune"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">
                District <span className="text-red-500">*</span>
              </Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                required
                placeholder="Enter district"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">
                Province/City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                required
                placeholder="Enter province/city"
              />
            </div>
          </div>

          {/* Interactive Map Section - Always Visible */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium text-gray-900">
                  Select Delivery Location on Map
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1 border-purple-200 text-purple-600 transition-colors duration-200 hover:border-purple-300 hover:bg-purple-50"
                onClick={handleGeocodeAddress}
                disabled={!formData.district || !formData.province}
              >
                <MapPin className="h-4 w-4" />
                Find Address
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              📍 Click anywhere on the map to set your delivery address. You can
              also use the &quot;Find Address&quot; button to auto-locate from
              your entered district and province.
            </p>

            <div className="overflow-hidden rounded-lg border-2 border-blue-300 shadow-lg">
              <div
                style={{ height: '500px' }}
                id="inline-map-container"
                className="relative"
              >
                {typeof window !== 'undefined' && (
                  <InteractiveMapInline
                    initialLat={geocodedLocation?.lat || formData.latitude}
                    initialLng={geocodedLocation?.lng || formData.longitude}
                    addressQuery={`${formData.district}, ${formData.province}`.replace(
                      /^, |, $/,
                      ''
                    )}
                    onGeocodeRequest={handleGeocodeAddress}
                    onLocationSelect={(lat, lng) => {
                      setFormData({
                        ...formData,
                        latitude: lat,
                        longitude: lng,
                      });
                      setGeocodedLocation(null); // Clear geocoded location when manually selecting
                      const dist = calculateDistance(
                        lat,
                        lng,
                        STORE_LAT,
                        STORE_LNG
                      );
                      setDistance(dist);
                      toast.success(
                        `Location updated! Distance: ${dist.toFixed(2)} km`
                      );
                    }}
                  />
                )}
              </div>
            </div>

            {/* Manual coordinate input as fallback */}
            <details className="rounded-lg border border-gray-200 bg-gray-50">
              <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Or enter coordinates manually
              </summary>
              <div className="grid gap-3 p-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-xs">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="e.g. 10.762622"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-xs">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="e.g. 106.660172"
                    className="text-sm"
                  />
                </div>
              </div>
              <p className="mt-2 px-4 pb-3 text-xs text-gray-600">
                💡 Tip: Use{' '}
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Maps
                </a>{' '}
                (right-click → copy coordinates) or{' '}
                <a
                  href="https://www.latlong.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LatLong.net
                </a>
              </p>
            </details>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="default"
              checked={formData.default}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, default: checked as boolean })
              }
            />
            <Label
              htmlFor="default"
              className="cursor-pointer text-sm font-normal"
            >
              Set as default address
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700"
              disabled={isLoading}
            >
              {isLoading
                ? address
                  ? 'Updating...'
                  : 'Saving...'
                : address
                  ? 'Update address'
                  : 'Save address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
