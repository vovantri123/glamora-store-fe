'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Target, MapPin } from 'lucide-react';
import { toast } from 'sonner';

// Store location (SPKT coordinates)
const STORE_LAT = 10.850769;
const STORE_LNG = 106.771848;

interface InteractiveMapInlineProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  addressQuery?: string; // Optional address string for geocoding
  onGeocodeRequest?: () => void; // Callback to trigger geocoding from parent
}

export default function InteractiveMapInline({
  initialLat,
  initialLng,
  onLocationSelect,
  addressQuery,
  onGeocodeRequest,
}: InteractiveMapInlineProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const deliveryMarkerRef = useRef<any>(null);
  const [storeMarker, setStoreMarker] = useState<any>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);

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

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already loaded
    if ((window as any).L) {
      setL((window as any).L);
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet Routing Machine CSS
    const routingCss = document.createElement('link');
    routingCss.rel = 'stylesheet';
    routingCss.href =
      'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
    document.head.appendChild(routingCss);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // Load Leaflet Routing Machine after Leaflet
      const routingScript = document.createElement('script');
      routingScript.src =
        'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
      routingScript.onload = () => {
        setL((window as any).L);
      };
      document.head.appendChild(routingScript);
    };
    document.head.appendChild(script);

    return () => {
      link.remove();
      routingCss.remove();
      script.remove();
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || map) return;

    try {
      // Create map
      const mapInstance = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(
        [initialLat || STORE_LAT, initialLng || STORE_LNG],
        initialLat && initialLng ? 15 : 12
      );

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Add store marker (orange, always visible)
      const storeIcon = L.divIcon({
        html: `<div style="background-color: #f97316; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <span style="transform: rotate(45deg); color: white; font-size: 18px; font-weight: bold;">🏪</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: 'custom-store-marker',
      });

      const storeMrk = L.marker([STORE_LAT, STORE_LNG], {
        icon: storeIcon,
        draggable: false,
      })
        .addTo(mapInstance)
        .bindPopup(
          '<strong>🏪 Glamora Store</strong><br/>SPKT Campus<br/>Click "Show Route" to see directions',
          { className: 'custom-popup' }
        );

      storeMrk.openPopup();
      setStoreMarker(storeMrk);

      // Add delivery marker if coordinates provided (blue, draggable)
      if (initialLat && initialLng) {
        const deliveryIcon = L.divIcon({
          html: `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <span style="transform: rotate(45deg); color: white; font-size: 16px;">📍</span>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
          className: 'custom-delivery-marker',
        });

        const deliveryMrk = L.marker([initialLat, initialLng], {
          icon: deliveryIcon,
          draggable: true,
        })
          .addTo(mapInstance)
          .bindPopup(
            '<strong>📍 Delivery Location</strong><br/>Drag to adjust',
            {
              className: 'custom-popup',
            }
          );

        // Handle marker drag
        deliveryMrk.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          const dist = calculateDistance(
            pos.lat,
            pos.lng,
            STORE_LAT,
            STORE_LNG
          );
          setDistance(dist);
          try {
            onLocationSelect(pos.lat, pos.lng);
          } catch (error) {
            console.warn('Error in onLocationSelect callback:', error);
          }
        });

        deliveryMarkerRef.current = deliveryMrk;

        // Calculate initial distance
        const dist = calculateDistance(
          initialLat,
          initialLng,
          STORE_LAT,
          STORE_LNG
        );
        setDistance(dist);
      }

      // Handle map click to add/move delivery marker
      mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;

        // Calculate distance first to avoid multiple state updates
        const dist = calculateDistance(lat, lng, STORE_LAT, STORE_LNG);
        setDistance(dist);

        // Call callback in try-catch to prevent errors from bubbling
        try {
          onLocationSelect(lat, lng);
        } catch (error) {
          console.warn('Error in onLocationSelect callback:', error);
        }

        // Remove old marker if exists
        if (deliveryMarkerRef.current) {
          mapInstance.removeLayer(deliveryMarkerRef.current);
        }

        // Create new delivery marker
        const deliveryIcon = L.divIcon({
          html: `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <span style="transform: rotate(45deg); color: white; font-size: 16px;">📍</span>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
          className: 'custom-delivery-marker',
        });

        const newMarker = L.marker([lat, lng], {
          icon: deliveryIcon,
          draggable: true,
        })
          .addTo(mapInstance)
          .bindPopup(
            '<strong>📍 Delivery Location</strong><br/>Drag to adjust',
            { className: 'custom-popup' }
          );

        newMarker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          const dist = calculateDistance(
            pos.lat,
            pos.lng,
            STORE_LAT,
            STORE_LNG
          );
          setDistance(dist);
          try {
            onLocationSelect(pos.lat, pos.lng);
          } catch (error) {
            console.warn('Error in onLocationSelect callback:', error);
          }
        });

        deliveryMarkerRef.current = newMarker;
      });

      setMap(mapInstance);
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Failed to load map');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L]);

  // Update delivery marker when coordinates change externally
  useEffect(() => {
    if (!map || !L || !initialLat || !initialLng) return;

    if (deliveryMarkerRef.current) {
      deliveryMarkerRef.current.setLatLng([initialLat, initialLng]);
      map.setView([initialLat, initialLng], 15);
      const dist = calculateDistance(
        initialLat,
        initialLng,
        STORE_LAT,
        STORE_LNG
      );
      setDistance(dist);
    } else {
      // Create delivery marker if it doesn't exist
      const deliveryIcon = L.divIcon({
        html: `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <span style="transform: rotate(45deg); color: white; font-size: 16px;">📍</span>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
        className: 'custom-delivery-marker',
      });

      const newMarker = L.marker([initialLat, initialLng], {
        icon: deliveryIcon,
        draggable: true,
      })
        .addTo(map)
        .bindPopup('<strong>📍 Delivery Location</strong><br/>Drag to adjust', {
          className: 'custom-popup',
        });

      newMarker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        const dist = calculateDistance(pos.lat, pos.lng, STORE_LAT, STORE_LNG);
        setDistance(dist);
        try {
          onLocationSelect(pos.lat, pos.lng);
        } catch (error) {
          console.warn('Error in onLocationSelect callback:', error);
        }
      });

      deliveryMarkerRef.current = newMarker;
      const dist = calculateDistance(
        initialLat,
        initialLng,
        STORE_LAT,
        STORE_LNG
      );
      setDistance(dist);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLat, initialLng, map, L]);

  // Use my location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        onLocationSelect(lat, lng);
        if (map) {
          map.setView([lat, lng], 16);
        }
        toast.success('Using your current location');
      },
      (error) => {
        toast.error('Unable to get your location');
        console.error(error);
      }
    );
  };

  // Go to store location
  const handleGoToStore = () => {
    if (map) {
      map.setView([STORE_LAT, STORE_LNG], 16);
      if (storeMarker) {
        storeMarker.openPopup();
      }
      toast.info('Centered on store location');
    }
  };

  // Show route from delivery to store
  const handleShowRoute = () => {
    if (!L || !map || !deliveryMarkerRef.current) {
      toast.error('Please select a delivery location first');
      return;
    }

    // Check if Routing is available
    if (!L.Routing || !L.Routing.control) {
      toast.error(
        'Routing library not loaded yet. Please try again in a moment.'
      );
      return;
    }

    // Remove existing routing control if any
    if (routingControl) {
      map.removeControl(routingControl);
      setRoutingControl(null);
    }

    try {
      const deliveryPos = deliveryMarkerRef.current.getLatLng();

      // Create routing control (from store to delivery)
      const control = L.Routing.control({
        waypoints: [
          L.latLng(STORE_LAT, STORE_LNG),
          L.latLng(deliveryPos.lat, deliveryPos.lng),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        show: false, // Hide the itinerary panel (only show route line)
        lineOptions: {
          styles: [
            {
              color: '#2563eb',
              opacity: 0.9,
              weight: 5,
            },
          ],
        },
        createMarker: () => null, // Don't create default markers (we have custom ones)
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
        }),
      }).addTo(map);

      // Listen for routes found
      control.on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distanceKm = (summary.totalDistance / 1000).toFixed(2);
        const timeMin = Math.round(summary.totalTime / 60);
        toast.success(
          `Route found! Distance: ${distanceKm} km, Est. time: ${timeMin} min`,
          { duration: 5000 }
        );
      });

      control.on('routingerror', (e: any) => {
        console.error('Routing error:', e);
        toast.error('Could not find route. Please check the locations.');
      });

      setRoutingControl(control);
    } catch (error) {
      console.error('Error creating route:', error);
      toast.error('Routing feature not available');
    }
  };

  // Geocode address to coordinates using Nominatim (OpenStreetMap)
  const handleGeocodeAddress = async () => {
    if (!addressQuery || !addressQuery.trim()) {
      toast.error('Please enter district and province first');
      return;
    }

    if (!map) {
      toast.error('Map not loaded yet');
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

        // Update map view and marker
        onLocationSelect(lat, lng);
        map.setView([lat, lng], 15);

        // Calculate distance
        const dist = calculateDistance(lat, lng, STORE_LAT, STORE_LNG);
        setDistance(dist);

        // Remove old marker if exists
        if (deliveryMarkerRef.current) {
          map.removeLayer(deliveryMarkerRef.current);
        }

        // Create new delivery marker
        const deliveryIcon = L.divIcon({
          html: `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <span style="transform: rotate(45deg); color: white; font-size: 16px;">📍</span>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
          className: 'custom-delivery-marker',
        });

        const newMarker = L.marker([lat, lng], {
          icon: deliveryIcon,
          draggable: true,
        })
          .addTo(map)
          .bindPopup(
            `<strong>📍 Location Found</strong><br/>${result.display_name}<br/>Drag to adjust`,
            { className: 'custom-popup' }
          );

        newMarker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          const dist = calculateDistance(
            pos.lat,
            pos.lng,
            STORE_LAT,
            STORE_LNG
          );
          setDistance(dist);
          try {
            onLocationSelect(pos.lat, pos.lng);
          } catch (error) {
            console.warn('Error in onLocationSelect callback:', error);
          }
        });

        deliveryMarkerRef.current = newMarker;
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

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Distance Badge */}
      {distance !== null && (
        <div className="absolute right-2 top-2 z-[1000] rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 shadow-lg">
          <p className="text-xs font-medium text-white/90">Distance to Store</p>
          <p className="text-xl font-bold text-white">
            {distance.toFixed(2)} km
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute left-2 top-2 z-[1000] flex flex-col gap-2">
        <Button
          type="button"
          size="sm"
          className="gap-1 bg-blue-600 text-white shadow-md hover:bg-blue-700"
          onClick={handleUseMyLocation}
        >
          <Navigation className="h-4 w-4" />
          My Location
        </Button>
        <Button
          type="button"
          size="sm"
          className="gap-1 bg-green-600 text-white shadow-md hover:bg-green-700"
          onClick={handleGoToStore}
        >
          <Target className="h-4 w-4" />
          Go to Store
        </Button>

        <Button
          type="button"
          size="sm"
          className="gap-1 bg-orange-500 text-white shadow-md hover:bg-orange-600"
          onClick={handleShowRoute}
        >
          🗺️ Show Route
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 right-2 z-[1000] rounded-lg bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur-sm">
        <p className="font-medium text-gray-800">
          📍 Click anywhere on the map to set delivery location
        </p>
        <p className="text-gray-600">
          🏪 Orange marker = Store | 📍 Blue marker = Delivery (draggable)
        </p>
        <p className="text-purple-600">
          🔍 Purple button = Find location from district/province
        </p>
      </div>
    </div>
  );
}
