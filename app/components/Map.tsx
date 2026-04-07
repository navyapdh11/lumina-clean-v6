'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function Map() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
    }).setView([-25.2744, 133.7751], 4);

    // Mark as loaded after tiles start rendering
    map.whenReady(() => setLoaded(true));

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
    <div className="relative h-full w-full">
      {/* Loading skeleton — shown while Leaflet initializes */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-emerald-surface-low">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-primary/20 border-t-emerald-primary animate-spin mb-3" />
          <p className="text-emerald-text-muted text-xs">Loading map…</p>
          {/* Skeleton shimmer over map area */}
          <div className="absolute inset-0 skeleton opacity-40" />
        </div>
      )}
      <div
        ref={mapRef}
        className="h-full w-full"
        aria-label="Service coverage map"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
