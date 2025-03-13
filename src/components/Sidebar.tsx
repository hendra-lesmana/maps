'use client';

import { useState } from 'react';

interface SidebarProps {
  onCatalogueClick?: () => void;
}

const Sidebar = ({ onCatalogueClick }: SidebarProps = {}) => {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);
  
  const handleCatalogueClick = () => {
    setShowCataloguePanel(!showCataloguePanel);
    if (onCatalogueClick) onCatalogueClick();
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

      {showCataloguePanel && <CataloguePanel onClose={() => setShowCataloguePanel(false)} />}
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

const CataloguePanel = ({ onClose }: CataloguePanelProps) => {
  return (
    <div className="fixed left-[120px] top-5 h-[calc(100%-40px)] w-[250px] bg-[rgba(51,51,51,0.9)] z-5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Catalogue</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-3">
          <CatalogueItem title="Landmarks" count={24} />
          <CatalogueItem title="Natural Features" count={18} />
          <CatalogueItem title="Urban Areas" count={42} />
          <CatalogueItem title="Infrastructure" count={36} />
          <CatalogueItem title="Custom Markers" count={12} />
        </div>
      </div>
    </div>
  );
};

interface CatalogueItemProps {
  title: string;
  count: number;
}

const CatalogueItem = ({ title, count }: CatalogueItemProps) => {
  return (
    <div className="p-3 bg-[#444] rounded-lg cursor-pointer hover:bg-[#555] transition-colors">
      <div className="flex justify-between items-center">
        <span>{title}</span>
        <span className="bg-[#666] px-2 py-1 rounded-full text-xs">{count}</span>
      </div>
    </div>
  );
};

export default Sidebar;