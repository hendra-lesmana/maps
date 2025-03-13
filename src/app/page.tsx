'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      <Sidebar 
        onCatalogueClick={() => setShowCataloguePanel(true)} 
        onSetDrawingMode={setDrawingMode}
      />
      <Map 
        showPanel={showCataloguePanel} 
        setShowPanel={setShowCataloguePanel} 
        drawingMode={drawingMode}
      />
    </main>
  );
}
