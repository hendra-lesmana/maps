'use client';

import { useRef, useState, useEffect } from 'react';
import { Map as MapGL, Marker, Source, Layer, MapRef } from '@vis.gl/react-maplibre';
import type maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapIcon, LocationIcon, PlusIcon, MinusIcon, PointIcon, PolygonIcon, TrashIcon } from './icons';
import { SearchResult } from '../lib/search/providers';

const buttonStyle: React.CSSProperties & { ':hover': React.CSSProperties } = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  border: 'none',
  borderRadius: '4px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#ffffff',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
};

interface MapProps {
  showPanel?: boolean;
  setShowPanel?: (show: boolean) => void;
  drawingMode?: string | null;
  selectedLocation?: SearchResult | null;
}

const basemaps = {
  OpenStreetMap: {
    style: {
      version: 8 as const,
      sources: {
        osm: {
          type: 'raster' as const,
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'osm',
          type: 'raster' as const,
          source: 'osm',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  Satellite: {
    style: {
      version: 8 as const,
      sources: {
        satellite: {
          type: 'raster' as const,
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'satellite',
          type: 'raster' as const,
          source: 'satellite',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  Light: {
    style: {
      version: 8 as const,
      sources: {
        light: {
          type: 'raster' as const,
          tiles: ['https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'light',
          type: 'raster' as const,
          source: 'light',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  Dark: {
    style: {
      version: 8 as const,
      sources: {
        dark: {
          type: 'raster' as const,
          tiles: ['https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'dark',
          type: 'raster' as const,
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
  setLocationMarker,
  setShowPanel
}: {
  selectedBasemap: string;
  setSelectedBasemap: (basemap: string) => void;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
  showPanel?: boolean;
  setLocationMarker: (coords: [number, number] | null) => void;
  setShowPanel?: (show: boolean) => void;
}) => {
const mapRef = useRef<MapRef>(null);

  const handleBasemapChange = (basemap: string) => {
    setSelectedBasemap(basemap);
    setShowSelector(false);
    if (setShowPanel) setShowPanel(false);
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
          style={buttonStyle}
          title="Change Map Style"
        >
          <MapIcon />
        </button>
        <button
          onClick={handleLocationClick}
          style={buttonStyle}
          title="Find My Location"
        >
          <LocationIcon />
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
                ...buttonStyle,
                width: '100%',
                height: 'auto',
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: selectedBasemap === basemap ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                justifyContent: 'flex-start'
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

const MapControls = ({ mapRef }: { mapRef: React.RefObject<MapRef> }) => {
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
          style={buttonStyle}
          title="Zoom In"
        >
          <PlusIcon />
        </button>
        <button
          onClick={handleZoomOut}
          style={buttonStyle}
          title="Zoom Out"
        >
          <MinusIcon />
        </button>
      </div>
    </div>
  );
};

const DrawingControls = ({ drawingMode, setDrawingMode, polygonPoints, setPolygonPoints, setIsDrawingPolygon }: { drawingMode: string | null; setDrawingMode: (mode: string | null) => void; polygonPoints: number[][]; setPolygonPoints: (points: number[][]) => void; isDrawingPolygon: boolean; setIsDrawingPolygon: (isDrawing: boolean) => void }) => {
  const clearPolygon = () => {
    setPolygonPoints([]);
    setDrawingMode(null);
    setIsDrawingPolygon(false);
  };

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
              setPolygonPoints([]);
            }
          }}
          style={{
            ...buttonStyle,
            backgroundColor: drawingMode === 'point' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
          }}
          title="Draw Point"
        >
          <PointIcon />
        </button>
        <button
          onClick={() => {
            if (drawingMode === 'polygon') {
              clearPolygon();
            } else {
              setDrawingMode('polygon');
              setPolygonPoints([]);
            }
          }}
          style={{
            ...buttonStyle,
            backgroundColor: drawingMode === 'polygon' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
          }}
          title="Draw Polygon"
        >
          <PolygonIcon />
        </button>
        {drawingMode === 'polygon' && polygonPoints.length > 0 && (
          <button
            onClick={clearPolygon}
            style={buttonStyle}
            title="Clear Polygon"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const Map = ({ setShowPanel, drawingMode, selectedLocation }: MapProps) => {
  const [selectedBasemap, setSelectedBasemap] = useState('OpenStreetMap');
  const [showSelector, setShowSelector] = useState(false);
  const [locationMarker, setLocationMarker] = useState<[number, number] | null>(null);
  const [currentDrawingMode, setCurrentDrawingMode] = useState<string | null>(drawingMode || null);
  const [polygonPoints, setPolygonPoints] = useState<number[][]>([]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const mapRef = useRef<MapRef>(null);

  // Update currentDrawingMode when drawingMode prop changes
  useEffect(() => {
    setCurrentDrawingMode(drawingMode || null);
    if (!drawingMode) {
      setPolygonPoints([]);
      setIsDrawingPolygon(false);
    }
  }, [drawingMode]);

  useEffect(() => {
    if (selectedLocation?.boundingBox) {
      const { minLon, maxLon, minLat, maxLat } = selectedLocation.boundingBox;
      const bounds: maplibregl.LngLatBoundsLike = [
        [minLon, minLat],
        [maxLon, maxLat]
      ];
      mapRef.current?.fitBounds(bounds, {
        padding: 50,
        maxZoom: 16
      });
    } else if (selectedLocation?.location) {
      mapRef.current?.flyTo({
        center: [selectedLocation.location.lon, selectedLocation.location.lat],
        zoom: 16,
      });
    }
  }, [selectedLocation]);

  const handleMapClick = (e: maplibregl.MapMouseEvent & { lngLat: maplibregl.LngLat }) => {
    if (currentDrawingMode === 'point') {
      setLocationMarker([e.lngLat.lng, e.lngLat.lat]);
    } else if (currentDrawingMode === 'polygon') {
      const newPoint = [e.lngLat.lng, e.lngLat.lat];
      if (!isDrawingPolygon) {
        setIsDrawingPolygon(true);
        setPolygonPoints([newPoint]);
      } else if (polygonPoints.length > 0) {
        const firstPoint = polygonPoints[0];
        if (firstPoint) {
          const distance = Math.sqrt(
            Math.pow(newPoint[0] - firstPoint[0], 2) + 
            Math.pow(newPoint[1] - firstPoint[1], 2)
          );

          if (distance < 0.0001 && polygonPoints.length > 2) {
            // Close the polygon
            setPolygonPoints([...polygonPoints, [...firstPoint]]);
            setIsDrawingPolygon(false);
          } else {
            // Add new point to polygon
            setPolygonPoints([...polygonPoints, newPoint]);
          }
        }
      }
    }
  };

  const polygonGeoJSON: GeoJSON.Feature = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[...polygonPoints,
        isDrawingPolygon && polygonPoints.length > 0 ? polygonPoints[0] : polygonPoints[polygonPoints.length - 1] || [0, 0]
      ]]
    }
  };

  const polygonLayerStyle: maplibregl.LayerSpecification = {
    id: 'polygon-layer',
    type: 'fill',
    source: 'polygon-source',
    paint: {
      'fill-color': '#0080ff',
      'fill-opacity': 0.5
    }
  };

  const polygonOutlineStyle: maplibregl.LayerSpecification = {
    id: 'polygon-outline',
    type: 'line',
    source: 'polygon-source',
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

      {/* Location boundary visualization removed */}

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
        setShowPanel={setShowPanel}
      />

      <DrawingControls
        drawingMode={currentDrawingMode}
        setDrawingMode={setCurrentDrawingMode}
        polygonPoints={polygonPoints}
        setPolygonPoints={setPolygonPoints}
        isDrawingPolygon={isDrawingPolygon}
        setIsDrawingPolygon={setIsDrawingPolygon}
      />
    </div>
  );
};

export default Map;