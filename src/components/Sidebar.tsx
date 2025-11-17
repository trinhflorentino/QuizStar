import React from 'react';

interface SidebarProps {
  onBackClick: () => void;
}

interface NavButtonProps {
  icon: string;
  tooltip: string;
  target: string;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, tooltip, target }) => (
  <div className="my-4">
    <button 
      data-tab-target={target}
      className="tab-button text-black border border-neutral-300 hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm p-4 text-center inline-flex items-center me-2 dark:border-white dark:text-white dark:hover:text-black dark:focus:ring-white dark:hover:bg-white"
    >
      <span className="material-symbols-outlined">{icon}</span>
    </button>
    <div className="tooltip">{tooltip}</div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ onBackClick }) => {
  return (
    <aside className="fixed top-0 left-0 z-40 w-32 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r-2 border-neutral-100 dark:border-gray-500 flex flex-col justify-between items-center">
      {/* App Logo */}
      <div className="mt-6">
        <img 
          id="appLogoImage" 
          src="img/appLogo.png" 
          className="rounded-full w-16 h-16 cursor-default" 
          alt="appLogo" 
        />
      </div>

      {/* Back Button */}
      <div className="my-4">
        <button 
          onClick={onBackClick}
          className="tab-button text-black border border-neutral-300 hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm p-4 text-center inline-flex items-center me-2 dark:border-white dark:text-white dark:hover:text-black dark:focus:ring-white dark:hover:bg-white"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col items-center">
        {/* Play Icon */}
        <NavButton icon="play_arrow" tooltip="Chơi trò chơi" target="#home" />
        
        {/* Match List Icon */}
        <NavButton icon="splitscreen_landscape" tooltip="Danh sách phòng trò chơi" target="#matches" />
        
        {/* Video Setup Icon */}
        <NavButton icon="movie" tooltip="Thiết lập Video giới thiệu" target="#video" />
        
        {/* Theme Icon */}
        <NavButton icon="palette" tooltip="Chỉnh sửa giao diện" target="#theme" />
      </div>

      {/* Avatar */}
      <div className="mb-4">
        <button data-tab-target="#profile" className="tab-button">
          <img 
            src="img/userAvatar.png" 
            alt="avatar" 
            className="relative inline-block h-14 w-14 rounded-full object-cover object-center" 
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;




