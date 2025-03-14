'use client';

import { useEffect, useRef, useState } from 'react';
import { Map as MapGL, Marker, Source, Layer } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  showPanel?: boolean;
  setShowPanel?: (show: boolean) => void;
  drawingMode?: string | null;
}

const basemaps = {
  OpenStreetMap: {
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  Satellite: {
    style: {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'satellite',
          type: 'raster',
          source: 'satellite',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  Light: {
    style: {
      version: 8,
      sources: {
        light: {
          type: 'raster',
          tiles: ['https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'light',
          type: 'raster',
          source: 'light',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  Dark: {
    style: {
      version: 8,
      sources: {
        dark: {
          type: 'raster',
          tiles: ['https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'dark',
          type: 'raster',
          source: 'dark',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
};

const SideControlPanel = ({ 
  selectedBasemap,
  setSelectedBasemap,
  showSelector,
  setShowSelector, 
  setLocationMarker 
}: {
  selectedBasemap: string;
  setSelectedBasemap: (basemap: string) => void;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
  setLocationMarker: (coords: [number, number] | null) => void;
}) => {
const mapRef = useRef<any>(null);

  const handleBasemapChange = (basemap: string) => {
    setSelectedBasemap(basemap);
    setShowSelector(false);
  };

  const handleLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationMarker([position.coords.longitude, position.coords.latitude]);
        mapRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 16,
        });
      });
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '120px',
      right: '10px',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{
        backgroundColor: 'rgba(51, 51, 51, 0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={() => setShowSelector(!showSelector)}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '16px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Change Map Style"
        >
          🗺️
        </button>
        <button
          onClick={handleLocationClick}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '16px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Find My Location"
        >
          📍
        </button>
      </div>

      {showSelector && (
        <div style={{
          position: 'absolute',
          backgroundColor: 'rgba(51, 51, 51, 0.9)',
          padding: '10px',
          borderRadius: '8px',
          right: '60px',
          top: '0',
          minWidth: '150px'
        }}>
          {Object.keys(basemaps).map((basemap) => (
            <button
              key={basemap}
              onClick={() => handleBasemapChange(basemap)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: selectedBasemap === basemap ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '4px',
                textAlign: 'left'
              }}
            >
              {basemap}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MapControls = ({ mapRef }: { mapRef: React.RefObject<any> }) => {
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{
        backgroundColor: 'rgba(51, 51, 51, 0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '16px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '16px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Zoom Out"
        >
          -
        </button>
      </div>
    </div>
  );
};

const Map = ({ showPanel = false, setShowPanel, drawingMode: externalDrawingMode }: MapProps = {}) => {
  const [drawingMode, setDrawingMode] = useState(null);
  const [currentMarker, setCurrentMarker] = useState<[number, number] | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<number[][]>([]);
  const [selectedBasemap, setSelectedBasemap] = useState('OpenStreetMap');
  const [showSelector, setShowSelector] = useState(false);
  const [locationMarker, setLocationMarker] = useState<[number, number] | null>(null);
const mapRef = useRef<any>(null);

  useEffect(() => {
    if (externalDrawingMode) {
      setDrawingMode(externalDrawingMode as unknown as null);
    }
  }, [externalDrawingMode]);

  const handleMapClick = (e: { lngLat: { lng: number; lat: number } }) => {
    if (drawingMode === 'point') {
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCurrentMarker(coordinates);
      console.log('Point selected:', e.lngLat);
      
      // Zoom to the marker location with smooth animation
      mapRef.current?.flyTo({
        center: coordinates,
        zoom: 16,
        duration: 1000, // Add smooth animation duration
        essential: true // This animation is considered essential for the user experience
      });
    } else if (drawingMode === 'polygon') {
      const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setPolygonPoints(prev => [...prev, coordinates]);
      
      // Also zoom to the latest polygon point with a slightly different zoom level
      mapRef.current?.flyTo({
        center: coordinates,
        zoom: 15,
        duration: 800, // Slightly faster animation for polygon points
        essential: true
      });
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapGL
        ref={mapRef as React.RefObject<any>}
        initialViewState={{
          longitude: 118,
          latitude: -2.5,
          zoom: 4
        }}
        style={{ height: '100%', width: '100%' }}
        mapStyle={basemaps[selectedBasemap as keyof typeof basemaps].style as any}
        onClick={handleMapClick}
      >
        {currentMarker && (
          <Marker
            longitude={currentMarker[0]}
            latitude={currentMarker[1]}
          />
        )}
        
        {locationMarker && (
          <Marker
            longitude={locationMarker[0]}
            latitude={locationMarker[1]}
          />
        )}
        
        {polygonPoints.length > 0 && (
          <Source
            id="polygon"
            type="geojson"
            data={{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [polygonPoints]
              }
            }}
          >
            <Layer
              id="polygon-fill"
              type="fill"
              paint={{
                'fill-color': '#0080ff',
                'fill-opacity': 0.5
              }}
            />
            <Layer
              id="polygon-outline"
              type="line"
              paint={{
                'line-color': '#0080ff',
                'line-width': 2
              }}
            />
          </Source>
        )}
      </MapGL>
      <SideControlPanel
        selectedBasemap={selectedBasemap}
        setSelectedBasemap={setSelectedBasemap}
        showSelector={showSelector}
        setShowSelector={setShowSelector}
        setLocationMarker={setLocationMarker as React.Dispatch<React.SetStateAction<[number, number] | null>>}
      />
      <MapControls mapRef={mapRef} />
    </div>
  );
};

export default Map;