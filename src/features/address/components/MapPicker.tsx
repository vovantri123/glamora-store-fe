'use client';

import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

export default function MapPicker({
  initialLat = 10.762622,
  initialLng = 106.660172,
  onSelect,
  onClose,
}: MapPickerProps) {
  const [selectedLat, setSelectedLat] = useState(initialLat);
  const [selectedLng, setSelectedLng] = useState(initialLng);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Pick Location on Map
          </DialogTitle>
          <DialogDescription>
            Open OpenStreetMap to select a location and copy the coordinates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <p className="text-sm text-orange-900">
              <strong>How to use:</strong>
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-orange-800">
              <li>Click &quot;Open Map Picker&quot; below</li>
              <li>
                On OpenStreetMap: <strong>Click anywhere</strong> on the map
              </li>
              <li>
                Right side will show coordinates - <strong>Copy them</strong>
              </li>
              <li>Come back here and paste coordinates</li>
              <li>Or use the interactive map below to adjust</li>
            </ol>
          </div>

          {/* Quick link to OSM for picking */}
          <div className="flex gap-3">
            <Button
              type="button"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => {
                window.open(
                  `https://www.openstreetmap.org/#map=15/${selectedLat}/${selectedLng}`,
                  '_blank'
                );
              }}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Open Map Picker (New Tab)
            </Button>
          </div>

          {/* Manual coordinate input with preview */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Latitude</label>
              <input
                type="number"
                step="any"
                value={selectedLat}
                onChange={(e) => setSelectedLat(parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="10.762622"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={selectedLng}
                onChange={(e) => setSelectedLng(parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="106.660172"
              />
            </div>
          </div>

          {/* Preview map */}
          {selectedLat && selectedLng && (
            <div className="overflow-hidden rounded-lg border border-gray-300">
              <iframe
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedLng - 0.01},${selectedLat - 0.01},${selectedLng + 0.01},${selectedLat + 0.01}&layer=mapnik&marker=${selectedLat},${selectedLng}`}
                style={{ border: 0 }}
              />
              <div className="bg-gray-100 px-3 py-2 text-center text-xs text-gray-600">
                Preview: {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={() => {
                onSelect(selectedLat, selectedLng);
                onClose();
              }}
            >
              Use This Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
