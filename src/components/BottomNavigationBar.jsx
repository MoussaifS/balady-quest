import React from 'react';
import { FiCompass, FiGitMerge, FiGrid, FiUser } from 'react-icons/fi';

function BottomNavigationBar() {
    const [activeTab, setActiveTab] = React.useState('Explore'); // Example state

    const tabs = [
        { name: 'Explore', icon: FiCompass },
        { name: 'Routes', icon: FiGitMerge },
        { name: 'Services', icon: FiGrid },
        { name: 'Profile', icon: FiUser },
    ];

    return (
        <nav className="relative flex-shrink-0 h-14 bg-white border-t border-gray-200 flex justify-around items-center z-40">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
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