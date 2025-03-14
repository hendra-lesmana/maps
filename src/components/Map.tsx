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

const DrawingControls = ({ drawingMode, setDrawingMode, polygonPoints, setPolygonPoints }: { drawingMode: string | null; setDrawingMode: (mode: string | null) => void; polygonPoints: number[][]; setPolygonPoints: (points: number[][]) => void }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '230px',
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
          onClick={() => {
            if (drawingMode === 'point') {
              setDrawingMode(null);
            } else {
              setDrawingMode('point');
            }
          }}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '16px',
            backgroundColor: drawingMode === 'point' ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Draw Point"
        >
          📍
        </button>
        <button
          onClick={() => {
            if (drawingMode === 'polygon') {
              setDrawingMode(null);
              setPolygonPoints([]);
            } else {
              setDrawingMode('polygon');
            }
          }}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '16px',
            backgroundColor: drawingMode === 'polygon' ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Draw Polygon"
        >
          🔷
        </button>
        {drawingMode === 'polygon' && polygonPoints.length > 0 && (
          <button
            onClick={() => {
              setPolygonPoints([]);
              setDrawingMode(null);
            }}
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
            title="Clear Polygon"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

const Map = ({ showPanel, setShowPanel, drawingMode }: MapProps) => {
  const [selectedBasemap, setSelectedBasemap] = useState('OpenStreetMap');
  const [showSelector, setShowSelector] = useState(false);
  const [locationMarker, setLocationMarker] = useState<[number, number] | null>(null);
  const [currentDrawingMode, setCurrentDrawingMode] = useState<string | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<number[][]>([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const mapRef = useRef<any>(null);

  const handleMapClick = (e: any) => {
    if (currentDrawingMode === 'point') {
      setLocationMarker([e.lngLat.lng, e.lngLat.lat]);
    } else if (currentDrawingMode === 'polygon') {
      const newPoint = [e.lngLat.lng, e.lngLat.lat];
      if (!isDrawingPolygon) {
        setIsDrawingPolygon(true);
        setPolygonPoints([newPoint]);
      } else {
        // Check if clicking near the first point to close the polygon
        const firstPoint = polygonPoints[0];
        const distance = Math.sqrt(
          Math.pow(newPoint[0] - firstPoint[0], 2) + 
          Math.pow(newPoint[1] - firstPoint[1], 2)
        );

        if (distance < 0.0001 && polygonPoints.length > 2) {
          // Close the polygon
          setPolygonPoints([...polygonPoints, [...firstPoint]]);
          setIsDrawingPolygon(false);
          setCurrentDrawingMode(null);
        } else {
          // Add new point to polygon
          setPolygonPoints([...polygonPoints, newPoint]);
        }
      }
    }
  };

  const polygonGeoJSON = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        ...polygonPoints,
        isDrawingPolygon && polygonPoints.length > 0 ? polygonPoints[0] : polygonPoints[polygonPoints.length - 1] || [0, 0]
      ]]
    }
  };

  const polygonLayerStyle = {
    id: 'polygon-layer',
    type: 'fill',
    paint: {
      'fill-color': '#0080ff',
      'fill-opacity': 0.5
    }
  };

  const polygonOutlineStyle = {
    id: 'polygon-outline',
    type: 'line',
    paint: {
      'line-color': '#0080ff',
      'line-width': 2
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <MapGL
        ref={mapRef}
        onClick={handleMapClick}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          longitude: 120.0,
          latitude: -5.0,
          zoom: 4
        }}
        mapStyle={basemaps[selectedBasemap as keyof typeof basemaps].style}
      >
        {locationMarker && (
          <Marker longitude={locationMarker[0]} latitude={locationMarker[1]} />
        )}

        {polygonPoints.length > 0 && (
          <Source type="geojson" data={polygonGeoJSON}>
            <Layer {...polygonLayerStyle} />
            <Layer {...polygonOutlineStyle} />
          </Source>
        )}
      </MapGL>

      <MapControls mapRef={mapRef} />
      
      <SideControlPanel
        selectedBasemap={selectedBasemap}
        setSelectedBasemap={setSelectedBasemap}
        showSelector={showSelector}
        setShowSelector={setShowSelector}
        setLocationMarker={setLocationMarker}
      />

      <DrawingControls
        drawingMode={currentDrawingMode}
        setDrawingMode={setCurrentDrawingMode}
        polygonPoints={polygonPoints}
        setPolygonPoints={setPolygonPoints}
      />
    </div>
  );
};

export default Map;