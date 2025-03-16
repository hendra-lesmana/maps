'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import { SearchResult } from '../lib/search';

export default function Home() {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Map 
        showPanel={showCataloguePanel} 
        setShowPanel={setShowCataloguePanel} 
        drawingMode={drawingMode}
        selectedLocation={selectedLocation}
      />
      <Sidebar 
        onCatalogueClick={() => setShowCataloguePanel(!showCataloguePanel)} 
        onSetDrawingMode={setDrawingMode}
        onLocationSelect={setSelectedLocation}
      />
    </main>
  );
}
