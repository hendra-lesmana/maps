'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);

  return (
    <main className="min-h-screen">
      <Sidebar onCatalogueClick={() => setShowCataloguePanel(true)} />
      <Map showPanel={showCataloguePanel} setShowPanel={setShowCataloguePanel} />
    </main>
  );
}
