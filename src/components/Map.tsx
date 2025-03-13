'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapProps {
  showPanel?: boolean;
  setShowPanel?: (show: boolean) => void;
  drawingMode?: string | null;
}

// Dynamically import Leaflet with no SSR
const Map = ({ showPanel = false, setShowPanel, drawingMode: externalDrawingMode }: MapProps = {}) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  
  // Update internal drawing mode when external prop changes
  useEffect(() => {
    if (externalDrawingMode) {
      setDrawingMode(externalDrawingMode);
    }
  }, [externalDrawingMode]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    // Dynamic import of Leaflet
    const initializeMap = async () => {
      const L = (await import('leaflet')).default;
      require('leaflet/dist/leaflet.css');

      // Initialize the map
      const map = L.map(mapContainerRef.current!).setView([-2.5, 118], 5);
(mapRef.current as any) = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add location button
      const locationButton = new L.Control({ position: 'bottomright' });
      locationButton.onAdd = () => {
        const button = L.DomUtil.create('button', 'location-button');
        button.innerHTML = '📍';
        button.onclick = () => {
          map.locate({ setView: true, maxZoom: 16 });
        };
        return button;
      };
      locationButton.addTo(map);

      // Add click handler for drawing
      map.on('click', (e) => {
        if (drawingMode === 'point') {
          if (currentMarker) {
            map.removeLayer(currentMarker);
          }
          const marker = L.marker(e.latlng).addTo(map);
          setCurrentMarker(marker as any);
          console.log('Point selected:', e.latlng);
        } else if (drawingMode === 'polygon') {
          const newPoints = [...polygonPoints, [e.latlng.lat, e.latlng.lng]];
          setPolygonPoints(newPoints);
          
          if (currentPolygon) {
            map.removeLayer(currentPolygon);
          }
          
          let newPolygon;
          if (newPoints.length > 2) {
            newPolygon = L.polygon(newPoints as L.LatLngExpression[]).addTo(map);
          } else {
            newPolygon = L.polyline(newPoints as L.LatLngExpression[]).addTo(map);
          }
          setCurrentPolygon(newPolygon as any);
        }
      });
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, [isMounted, drawingMode, currentMarker, currentPolygon, polygonPoints]);

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};

// Export the component with no SSR
export default dynamic(() => Promise.resolve(Map), {
  ssr: false
});