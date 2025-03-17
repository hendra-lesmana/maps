'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LayersIcon } from './icons';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  type: string;
}

interface LayerControlsProps {
  layers?: Layer[];
  onLayerChange?: (layerId: string, changes: Partial<Layer>) => void;
}

const buttonStyle: React.CSSProperties = {
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
};

const LayerControls = ({ layers = [], onLayerChange }: LayerControlsProps) => {
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  if (!layers || layers.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: '340px',
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
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          style={{
            ...buttonStyle,
            backgroundColor: showLayerPanel ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'
          }}
          title="Toggle Layers Panel"
        >
          <LayersIcon />
        </button>
      </div>

      {showLayerPanel && (
        <div style={{
          position: 'absolute',
          backgroundColor: 'rgba(51, 51, 51, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          right: '50px',
          top: '0',
          minWidth: '250px',
          maxWidth: '300px',
          width: 'auto',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            marginBottom: '15px',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <span>Layers</span>
            <button
              onClick={() => setShowLayerPanel(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '16px' }}
            >
              ×
            </button>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', width: '100%' }}>
            {layers.map((layer) => (
              <div key={layer.id} style={{
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', width: '100%' }}>
                  <span style={{ color: '#ffffff', fontSize: '14px', flex: 1, marginRight: '10px' }}>{layer.name}</span>
                  <button
                    onClick={() => onLayerChange && onLayerChange(layer.id, { visible: !layer.visible })}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex' }}
                    title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                  >
                    {layer.visible ? <EyeIcon /> : <EyeSlashIcon />}
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#ffffff', fontSize: '12px', minWidth: '60px' }}>Opacity:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.opacity * 100}
                    onChange={(e) => onLayerChange && onLayerChange(layer.id, { opacity: parseInt(e.target.value) / 100 })}
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: '#ffffff', fontSize: '12px', minWidth: '30px' }}>{Math.round(layer.opacity * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerControls;