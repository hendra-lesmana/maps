'use client';

import { useState, useMemo } from 'react';
import { MenuIcon, PointIcon, PolygonIcon } from './icons';
import { SearchService, SearchResult } from '../lib/search';

interface SidebarProps {
  onCatalogueClick?: () => void;
  onSetDrawingMode?: (mode: string | null) => void;
  onLocationSelect?: (location: SearchResult) => void;
}

const CatalogueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const DataIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const AIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
    <path d="M8 12s2-2 4-2 4 2 4 2"/>
    <path d="M9 9h.01"/>
    <path d="M15 9h.01"/>
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const Sidebar = ({ onCatalogueClick, onSetDrawingMode, onLocationSelect }: SidebarProps = {}) => {
  const [showCataloguePanel, setShowCataloguePanel] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const handleCatalogueClick = () => {
    setShowCataloguePanel(!showCataloguePanel);
    setShowDataPanel(false);
    setShowAIPanel(false);
    setShowCartPanel(false);
    if (onCatalogueClick) onCatalogueClick();
  };

  const handleDataClick = () => {
    setShowDataPanel(!showDataPanel);
    setShowCataloguePanel(false);
    setShowAIPanel(false);
    setShowCartPanel(false);
  };

  const handleAIClick = () => {
    setShowAIPanel(!showAIPanel);
    setShowCataloguePanel(false);
    setShowDataPanel(false);
    setShowCartPanel(false);
  };

  const handleCartClick = () => {
    setShowCartPanel(!showCartPanel);
    setShowCataloguePanel(false);
    setShowDataPanel(false);
    setShowAIPanel(false);
  };
  
  return (
    <>
      <div className="fixed left-5 top-5 h-[calc(100%-40px)] w-[90px] bg-[rgba(51,51,51,0.9)] z-10 flex flex-col items-center pt-5 rounded-xl shadow-lg">
        <div className="w-[60px] h-[60px] bg-[#333] rounded-lg mb-[30px] flex items-center justify-center">
          <MenuIcon />
        </div>
        
        <NavItem icon={<CatalogueIcon />} text="Catalogue" onClick={handleCatalogueClick} active={showCataloguePanel} />
        <NavItem icon={<DataIcon />} text="My Data" onClick={handleDataClick} active={showDataPanel} />
        <NavItem icon={<AIIcon />} text="AI Prompt" onClick={handleAIClick} active={showAIPanel} />
        <NavItem icon={<CartIcon />} text="Cart" onClick={handleCartClick} active={showCartPanel} />
      </div>

      {showCataloguePanel && <CataloguePanel onClose={() => setShowCataloguePanel(false)} onSetDrawingMode={onSetDrawingMode} onLocationSelect={onLocationSelect} />}
      {showDataPanel && <DataPanel onClose={() => setShowDataPanel(false)} />}
      {showAIPanel && <AIPanel onClose={() => setShowAIPanel(false)} />}
      {showCartPanel && <CartPanel onClose={() => setShowCartPanel(false)} />}
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
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
  onSetDrawingMode?: (mode: string | null) => void;
  onLocationSelect?: (location: SearchResult) => void;
}

const CataloguePanel = ({ onClose, onSetDrawingMode, onLocationSelect }: CataloguePanelProps) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const searchService = useMemo(() => new SearchService(), []);

  // Add debounce timer state
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

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
                value={searchQuery}
                onChange={async (e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  
                  // Clear any existing timer
                  if (searchTimer) {
                    clearTimeout(searchTimer);
                  }
                  
                  if (query.trim()) {
                    // Set a new timer for 500ms
                    const timer = setTimeout(async () => {
                      setIsSearching(true);
                      try {
                        const results = await searchService.search(query);
                        setSearchResults(results);
                      } catch (error) {
                        console.error('Search failed:', error);
                      } finally {
                        setIsSearching(false);
                      }
                    }, 500);
                    
                    setSearchTimer(timer);
                  } else {
                    setSearchResults([]);
                  }
                }}
                placeholder="Search location..." 
                className="w-full p-2 pl-8 pr-8 px-[15px] bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <svg className="absolute left-2 top-2.5 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    if (searchTimer) {
                      clearTimeout(searchTimer);
                    }
                  }}
                  className="absolute right-2 top-2.5 text-gray-300 hover:text-white focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchResults.length > 0 && (
                <div className="absolute w-full mt-1 bg-[#333] border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-2 hover:bg-white/10 cursor-pointer text-white text-sm"
                      onClick={() => {
                        if (onLocationSelect) {
                          onLocationSelect(result);
                        }
                        setSearchResults([]);
                        setSearchQuery(result.displayName);
                        setSelectedLocation(result);
                      }}
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-gray-300">{result.displayName}</div>
                    </div>
                  ))}
                </div>
              )}
              {isSearching && (
                <div className="absolute w-full mt-1 p-2 bg-[#333] border border-white/20 rounded-md text-white text-sm">
                  Searching...
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePointClick}
              className={`flex-1 py-3 ${activeButton === 'point' ? 'bg-[#2a75e6]' : 'bg-[#4285F4] hover:bg-[#2a75e6]'} text-white rounded-md flex items-center justify-center transition-colors`}
            >
              <span className="mr-2">
              <PointIcon />
              </span>
              <span>Point</span>
            </button>
            <button 
              onClick={handlePolygonClick}
              className={`flex-1 py-3 ${activeButton === 'polygon' ? 'bg-[#2a75e6]' : 'bg-[#4285F4] hover:bg-[#2a75e6]'} text-white rounded-md flex items-center justify-center transition-colors`}
            >
              <span className="mr-2">
              <PolygonIcon />
              </span>
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
      {selectedLocation && (
              <div className="mt-4 mb-4 mx-4 p-3 bg-white/5 rounded-lg">
                <h3 className="text-sm font-medium mb-2">{selectedLocation.name}</h3>
                {selectedLocation.address && (
                  <div className="text-xs text-gray-300 space-y-1">
                    {selectedLocation.address.road && <p>{selectedLocation.address.road}</p>}
                    <p>
                      {[selectedLocation.address.city, selectedLocation.address.state, selectedLocation.address.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                    {selectedLocation.address.postcode && <p>Postal Code: {selectedLocation.address.postcode}</p>}
                  </div>
                )}
                <div className="text-xs text-gray-300 mt-2">
                  <p>Coordinates: {selectedLocation.location.lat.toFixed(6)}, {selectedLocation.location.lon.toFixed(6)}</p>
                </div>
              </div>
            )}
    </div>
  );
};



export default Sidebar;


interface PanelProps {
  onClose: () => void;
}

const DataPanel = ({ onClose }: PanelProps) => {
  return (
    <div className="fixed left-[120px] top-5 h-[calc(100%-40px)] w-[300px] bg-[rgba(51,51,51,0.9)] z-5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Data</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm">Your data analysis and visualization will appear here.</p>
        </div>
      </div>
    </div>
  );
};

const AIPanel = ({ onClose }: PanelProps) => {
  return (
    <div className="fixed left-[120px] top-5 h-[calc(100%-40px)] w-[300px] bg-[rgba(51,51,51,0.9)] z-5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">AI Prompt</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <textarea
            placeholder="Enter your prompt here..."
            className="w-full p-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

const CartPanel = ({ onClose }: PanelProps) => {
  return (
    <div className="fixed left-[120px] top-5 h-[calc(100%-40px)] w-[300px] bg-[rgba(51,51,51,0.9)] z-5 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm">Your cart is empty.</p>
        </div>
      </div>
    </div>
  );
};