'use client';

import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function Home() {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);

  return (
    <main className="min-h-screen">
      <Sidebar onCatalogueClick={() => setShowCataloguePanel(true)} />
      <Map showPanel={showCataloguePanel} setShowPanel={setShowCataloguePanel} />
    </main>
  );
}
