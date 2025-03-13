'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapProps {
  showPanel?: boolean;
  setShowPanel?: (show: boolean) => void;
  drawingMode?: string | null;
}

// Define basemap options
const basemaps = {
  OpenStreetMap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  Light: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  Dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
};

// Dynamically import Leaflet with no SSR
const Map = ({ showPanel = false, setShowPanel, drawingMode: externalDrawingMode }: MapProps = {}) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [drawingMode, setDrawingMode] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [locationMarker, setLocationMarker] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [currentLayer, setCurrentLayer] = useState(null);
  const [showBasemapSelector, setShowBasemapSelector] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState('OpenStreetMap');

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
      const map = L.map(mapContainerRef.current!, {
        zoomControl: false
      }).setView([-2.5, 118], 5);
      (mapRef.current as any) = map;

      // Add OpenStreetMap tiles as default
      setCurrentLayer(L.tileLayer(basemaps.OpenStreetMap, {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map));

      // Add zoom control buttons
      const zoomControl = new L.Control({ position: 'topright' });
      zoomControl.onAdd = () => {
        const container = L.DomUtil.create('div', 'leaflet-bar');
        container.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
        container.style.padding = '5px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        const zoomInButton = L.DomUtil.create('button', '', container);
        zoomInButton.innerHTML = '+';
        zoomInButton.style.width = '30px';
        zoomInButton.style.height = '30px';
        zoomInButton.style.fontSize = '20px';
        zoomInButton.style.backgroundColor = 'transparent';
        zoomInButton.style.border = '1px solid rgba(255,255,255,0.2)';
        zoomInButton.style.color = 'white';
        zoomInButton.style.cursor = 'pointer';
        zoomInButton.style.borderRadius = '4px';
        zoomInButton.style.marginBottom = '5px';
        zoomInButton.style.display = 'block';
        zoomInButton.onclick = () => map.zoomIn();

        const zoomOutButton = L.DomUtil.create('button', '', container);
        zoomOutButton.innerHTML = '−';
        zoomOutButton.style.width = '30px';
        zoomOutButton.style.height = '30px';
        zoomOutButton.style.fontSize = '20px';
        zoomOutButton.style.backgroundColor = 'transparent';
        zoomOutButton.style.border = '1px solid rgba(255,255,255,0.2)';
        zoomOutButton.style.color = 'white';
        zoomOutButton.style.cursor = 'pointer';
        zoomOutButton.style.borderRadius = '4px';
        zoomOutButton.style.display = 'block';
        zoomOutButton.onclick = () => map.zoomOut();

        return container;
      };
      zoomControl.addTo(map);

      // Add basemap selector button
      const basemapButton = new L.Control({ position: 'topright' });
      basemapButton.onAdd = () => {
        const container = L.DomUtil.create('div', 'leaflet-bar');
        container.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
        container.style.padding = '5px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        container.style.marginTop = '10px';

        const button = L.DomUtil.create('button', '', container);
        button.innerHTML = '🗺️';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = 'transparent';
        button.style.border = '1px solid rgba(255,255,255,0.2)';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '4px';
        button.onclick = () => setShowBasemapSelector(!showBasemapSelector);

        return container;
      };
      basemapButton.addTo(map);

      // Add location button
      const locationButton = new L.Control({ position: 'topright' });
      locationButton.onAdd = () => {
        const container = L.DomUtil.create('div', 'leaflet-bar');
        container.style.backgroundColor = 'rgba(51, 51, 51, 0.9)';
        container.style.padding = '5px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        container.style.marginTop = '10px';

        const button = L.DomUtil.create('button', '', container);
        button.innerHTML = '📍';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = 'transparent';
        button.style.border = '1px solid rgba(255,255,255,0.2)';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '4px';
        button.style.display = 'block';
        button.onclick = () => {
          if (locationMarker) {
            map.removeLayer(locationMarker);
          }
          map.locate({ setView: true, maxZoom: 16 });
        };

        return container;
      };
      locationButton.addTo(map);

      // Add location found handler
      map.on('locationfound', (e) => {
        const redIcon = L.divIcon({
          className: 'custom-div-icon',
          html: "<div style='background-color: #ff4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);'></div>",
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker(e.latlng, { icon: redIcon }).addTo(map);
        setLocationMarker(marker);
      });

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

  // Effect to handle basemap changes
  useEffect(() => {
    if (!mapRef.current || !currentLayer) return;

    const map = mapRef.current as any;
    map.removeLayer(currentLayer);
    const L = require('leaflet');
    setCurrentLayer(L.tileLayer(basemaps[selectedBasemap], {
      attribution: selectedBasemap === 'OpenStreetMap' ? '© OpenStreetMap contributors' :
                  selectedBasemap === 'Satellite' ? '© Esri' :
                  '© Stadia Maps'
    }).addTo(map));
  }, [selectedBasemap]);

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      />
      {showBasemapSelector && (
        <div className="absolute top-5 right-24 z-10 bg-[rgba(51,51,51,0.9)] p-4 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(basemaps).map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedBasemap(name);
                  setShowBasemapSelector(false);
                }}
                className={`p-2 rounded-lg transition-all ${selectedBasemap === name ? 'ring-2 ring-blue-500' : 'hover:bg-white/10'}`}
              >
                <div className="w-full h-20 rounded-lg overflow-hidden mb-2 bg-gray-700">
                  {/* Placeholder for map preview */}
                  <div className="w-full h-full bg-opacity-50 bg-center bg-contain bg-no-repeat" style={{
                    backgroundImage: `url(${name === 'OpenStreetMap' ? '/osm-preview.svg' :
                                        name === 'Satellite' ? '/satellite-preview.svg' :
                                        name === 'Light' ? '/light-preview.svg' :
                                        '/dark-preview.svg'})`
                  }} />
                </div>
                <span className="text-white text-sm">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component with no SSR
export default dynamic(() => Promise.resolve(Map), {
  ssr: false
});