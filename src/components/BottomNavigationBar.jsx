import React from 'react';
import { FiCompass, FiList, FiGrid, FiUser } from 'react-icons/fi'; // Changed GitMerge to List

function BottomNavigationBar({ activeTab, onTabChange }) { // Added props
    const tabs = [
        { name: 'Explore', icon: FiCompass, view: 'map' }, // Link to map view (or initial list)
        { name: 'Experiences', icon: FiList, view: 'list' }, // Link to experience list
        { name: 'Services', icon: FiGrid, view: 'services' }, // Placeholder
        { name: 'Profile', icon: FiUser, view: 'profile' },
    ];

    return (
        <nav className="relative flex-shrink-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center z-40">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <button
                        key={tab.name}
                        onClick={() => onTabChange(tab.name, tab.view)} // Pass name and target view
                        className={`flex flex-col items-center justify-center h-full px-2 focus:outline-none ${
                            isActive ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                        } transition-colors duration-150 ease-in-out`}
                    >
                        <tab.icon size={22} />
                        <span className="text-xs mt-0.5 font-medium">{tab.name}</span>
                    </button>
                );
            })}
        </nav>
    );
}

export default BottomNavigationBar;