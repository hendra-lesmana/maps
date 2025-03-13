'use client';

import { useState } from 'react';

interface SidebarProps {
  onCatalogueClick?: () => void;
  onSetDrawingMode?: (mode: string) => void;
}

const Sidebar = ({ onCatalogueClick, onSetDrawingMode }: SidebarProps = {}) => {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  
  const handleCatalogueClick = () => {
    setShowCataloguePanel(!showCataloguePanel);
    if (onCatalogueClick) onCatalogueClick();
  };
  
  // Update the parent component when drawing mode changes
  const handleDrawingModeChange = (mode: string) => {
    setDrawingMode(mode);
    if (onSetDrawingMode) onSetDrawingMode(mode);
  };

  return (
    <>
      <div className="fixed left-5 top-5 h-[calc(100%-40px)] w-[90px] bg-[rgba(51,51,51,0.9)] z-10 flex flex-col items-center pt-5 rounded-xl shadow-lg">
        <div className="w-[60px] h-[60px] bg-[#333] rounded-lg mb-[30px] grid grid-cols-3 grid-rows-3 gap-[2px] p-2">
          {[...Array(9)].map((_, index) => (
            <div 
              key={index}
              className={`rounded-[2px] ${index === 0 ? 'bg-[#4CAF50]' : 'bg-[#2196F3]'}`}
            />
          ))}
        </div>
        
        <NavItem icon="📚" text="Catalogue" onClick={handleCatalogueClick} active={showCataloguePanel} />
        <NavItem icon="📊" text="My Data" />
        <NavItem icon="🤖" text="AI Prompt" />
        <NavItem icon="🛒" text="Cart" />
      </div>

      {showCataloguePanel && <CataloguePanel onClose={() => setShowCataloguePanel(false)} onSetDrawingMode={setDrawingMode} />}
    </>
  );
};

interface NavItemProps {
  icon: string;
  text: string;
  onClick?: () => void;
  active?: boolean;
}

const NavItem = ({ icon, text, onClick, active = false }: NavItemProps) => {
  return (
    <div 
      className={`w-full h-[90px] flex flex-col items-center justify-center text-white cursor-pointer transition-colors ${active ? 'bg-white/20' : 'hover:bg-white/10'}`}
      onClick={() => onClick ? onClick() : alert(`${text} section would open here`)}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs">{text}</div>
    </div>
  );
};

interface CataloguePanelProps {
  onClose: () => void;
}

interface CataloguePanelProps {
  onClose: () => void;
  onSetDrawingMode?: (mode: string) => void;
}

const CataloguePanel = ({ onClose, onSetDrawingMode }: CataloguePanelProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handlePointClick = () => {
    const mode = activeButton === 'point' ? null : 'point';
    setActiveButton(mode);
    if (onSetDrawingMode) onSetDrawingMode(mode);
  };

  const handlePolygonClick = () => {
    const mode = activeButton === 'polygon' ? null : 'polygon';
    setActiveButton(mode);
    if (onSetDrawingMode) onSetDrawingMode(mode);
  };

  return (
    <div className="fixed left-[120px] top-5 h-[calc(100%-40px)] w-[300px] bg-[rgba(51,51,51,0.9)] z-5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Find Insight</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm">Select Location</p>
            <p className="mb-3 text-xs text-gray-300">Choose an area by searching, dropping a pin, or drawing a custom polygon.</p>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full p-2 pl-8 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <svg className="absolute left-2 top-2.5 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePointClick}
              className={`flex-1 py-3 ${activeButton === 'point' ? 'bg-[#2a75e6]' : 'bg-[#4285F4] hover:bg-[#2a75e6]'} text-white rounded-md flex items-center justify-center transition-colors`}
            >
              <span className="mr-2">⊙</span>
              <span>Point</span>
            </button>
            <button 
              onClick={handlePolygonClick}
              className={`flex-1 py-3 ${activeButton === 'polygon' ? 'bg-[#2a75e6]' : 'bg-[#4285F4] hover:bg-[#2a75e6]'} text-white rounded-md flex items-center justify-center transition-colors`}
            >
              <span className="mr-2">⬡</span>
              <span>Polygon</span>
            </button>
          </div>
          {activeButton === 'polygon' && (
            <button
              onClick={() => {
                setActiveButton(null);
                if (onSetDrawingMode) onSetDrawingMode(null);
              }}
              className="w-full p-2 rounded bg-red-500 text-white mt-4"
            >
              Clear Polygon
            </button>
          )}
        </div>
      </div>
    </div>
  );
};



export default Sidebar;