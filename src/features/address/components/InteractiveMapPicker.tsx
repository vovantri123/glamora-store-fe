'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Target, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface InteractiveMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  storeLat: number;
  storeLng: number;
  onSelect: (lat: number, lng: number) => void;
  onClose: () => void;
}

export default function InteractiveMapPicker({
  initialLat = 10.762622,
  initialLng = 106.660172,
  storeLat,
  storeLng,
  onSelect,
  onClose,
}: InteractiveMapPickerProps) {
  const [selectedLat, setSelectedLat] = useState(initialLat);
  const [selectedLng, setSelectedLng] = useState(initialLng);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS and JS dynamically
    const loadLeaflet = () => {
      // Add Leaflet CSS
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Add Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => setMapReady(true);
        document.body.appendChild(script);
      } else {
        setMapReady(true);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapReady || !window.L) return;

    const map = window.L.map('interactive-map').setView(
      [selectedLat, selectedLng],
      13
    );

    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Store marker (fixed)
    const storeIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #f97316; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px;">🏪</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    window.L.marker([storeLat, storeLng], { icon: storeIcon })
      .addTo(map)
      .bindPopup('<b>Store Location</b>');

    // Selected location marker
    const marker = window.L.marker([selectedLat, selectedLng], {
      draggable: true,
    }).addTo(map);

    marker.bindPopup('<b>Delivery Address</b><br>Drag to adjust').openPopup();

    // Update coordinates when marker is dragged
    marker.on(
      'dragend',
      function (e: {
        target: { getLatLng: () => { lat: number; lng: number } };
      }) {
        const position = e.target.getLatLng();
        setSelectedLat(position.lat);
        setSelectedLng(position.lng);
      }
    );

    // Click on map to place marker
    map.on('click', function (e: { latlng: { lat: number; lng: number } }) {
      marker.setLatLng(e.latlng);
      setSelectedLat(e.latlng.lat);
      setSelectedLng(e.latlng.lng);
      marker.openPopup();
    });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, storeLat, storeLng]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLat(position.coords.latitude);
          setSelectedLng(position.coords.longitude);
          toast.success('Current location detected!');
        },
        () => {
          toast.error('Could not get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Pick Location on Interactive Map
          </DialogTitle>
          <DialogDescription>
            Click anywhere on the map to select a location, or drag the marker
            to adjust the position.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-900">📍 How to use:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-800">
              <li>
                <strong>Click anywhere</strong> on the map to set location
              </li>
              <li>
                <strong>Drag the marker</strong> to fine-tune position
              </li>
              <li>
                Use <strong>scroll to zoom</strong>, drag map to move around
              </li>
              <li>🏪 Orange marker = Store location (for reference)</li>
              <li>📍 Blue marker = Your selected delivery address</li>
            </ul>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleUseCurrentLocation}
              className="gap-1"
            >
              <Target className="h-4 w-4" />
              Use My Location
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedLat(storeLat);
                setSelectedLng(storeLng);
              }}
              className="gap-1"
            >
              <Navigation2 className="h-4 w-4" />
              Go to Store
            </Button>
          </div>

          {/* Map container */}
          <div
            id="interactive-map"
            style={{
              height: '450px',
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            className="border border-gray-300"
          ></div>

          {/* Selected coordinates display */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Latitude</label>
              <input
                type="number"
                step="any"
                value={selectedLat.toFixed(6)}
                onChange={(e) => setSelectedLat(parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={selectedLng.toFixed(6)}
                onChange={(e) => setSelectedLng(parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 border-t pt-4">
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

// Type declaration for Leaflet
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}
