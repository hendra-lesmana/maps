'use client';

const Sidebar = () => {
  return (
    <div className="fixed left-5 top-5 h-[calc(100%-40px)] w-[90px] bg-[rgba(51,51,51,0.9)] z-10 flex flex-col items-center pt-5 rounded-xl shadow-lg">
      <div className="w-[60px] h-[60px] bg-[#333] rounded-lg mb-[30px] grid grid-cols-3 grid-rows-3 gap-[2px] p-2">
        {[...Array(9)].map((_, index) => (
          <div 
            key={index}
            className={`rounded-[2px] ${index === 0 ? 'bg-[#4CAF50]' : 'bg-[#2196F3]'}`}
          />
        ))}
      </div>
      
      <NavItem icon="📚" text="Catalogue" />
      <NavItem icon="📊" text="My Data" />
      <NavItem icon="🤖" text="AI Prompt" />
      <NavItem icon="🛒" text="Cart" />
    </div>
  );
};

const NavItem = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <div 
      className="w-full h-[90px] flex flex-col items-center justify-center text-white cursor-pointer transition-colors hover:bg-white/10"
      onClick={() => alert(`${text} section would open here`)}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs">{text}</div>
    </div>
  );
};

export default Sidebar;