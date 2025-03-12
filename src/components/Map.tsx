'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet with no SSR
const Map = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    // Dynamic import of Leaflet
    const initializeMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Initialize the map
      const map = L.map(mapContainerRef.current).setView([-2.5, 118], 5);
      mapRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add location button
      const locationButton = L.control({ position: 'bottomright' });
      locationButton.onAdd = () => {
        const button = L.DomUtil.create('button', 'location-button');
        button.innerHTML = '📍';
        button.onclick = () => {
          map.locate({ setView: true, maxZoom: 16 });
        };
        return button;
      };
      locationButton.addTo(map);
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-screen"
      style={{ position: 'relative', zIndex: 0 }}
    />
  );
};

// Export the component with no SSR
export default dynamic(() => Promise.resolve(Map), {
  ssr: false
});