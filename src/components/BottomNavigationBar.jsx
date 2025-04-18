import React from 'react';
import { FiCompass, FiGitMerge, FiGrid, FiUser } from 'react-icons/fi';

function BottomNavigationBar() {
  const activeClass = "text-cyan-600"; // Active tab color
  const inactiveClass = "text-gray-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center z-20">
      <button className={`flex flex-col items-center ${activeClass}`}>
        <FiCompass size={22} />
        <span className="text-xs mt-1">Explore</span>
      </button>
      <button className={`flex flex-col items-center ${inactiveClass} hover:text-gray-700`}>
        <FiGitMerge size={22} />
        <span className="text-xs mt-1">Routes</span>
      </button>
      <button className={`flex flex-col items-center ${inactiveClass} hover:text-gray-700`}>
        <FiGrid size={22} />
        <span className="text-xs mt-1">Services</span>
      </button>
      <button className={`flex flex-col items-center ${inactiveClass} hover:text-gray-700`}>
        <FiUser size={22} />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </nav>
  );
}

export default BottomNavigationBar;