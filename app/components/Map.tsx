'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
    }).setView([-25.2744, 133.7751], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const cities = [
      { city: 'Sydney', lat: -33.8688, lng: 151.2093, experts: 142 },
      { city: 'Melbourne', lat: -37.8136, lng: 144.9631, experts: 98 },
      { city: 'Brisbane', lat: -27.4698, lng: 153.0251, experts: 67 },
      { city: 'Perth', lat: -31.9505, lng: 115.8605, experts: 54 },
      { city: 'Adelaide', lat: -34.9285, lng: 138.6007, experts: 41 },
    ];

    cities.forEach((loc) => {
      L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(
          `<strong>${loc.city}</strong><br/>${loc.experts} experts available now`,
        );
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="h-full w-full"
      aria-label="Service coverage map"
    />
  );
}
