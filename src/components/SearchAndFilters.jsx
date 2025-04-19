import React from 'react';
import { FiSearch, FiBookmark, FiNavigation, FiCoffee, FiShoppingCart, FiHome, FiMapPin } from 'react-icons/fi';

// Using a simpler chip style for categories
function CategoryChip({ icon: Icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex-shrink-0 flex flex-row items-center space-y-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-150 ease-in-out whitespace-nowrap w-[100px] text-center" // Adjusted width/padding
        >
            {Icon && <Icon size={18} className='mr-1 mt-1' />}
            <span>{label}</span>
        </button>
    );
}

function SearchAndFilters({ isMinimized, onSearchFocus }) {

    // Define category filters that appear ONLY when drawer is minimized
    const categoryFilters = [
        { id: 'saved', label: 'Saved', icon: FiBookmark },
        { id: 'go', label: 'Go', icon: FiNavigation },
        { id: 'eat', label: 'Eat out', icon: FiCoffee },
        { id: 'markets', label: 'Markets', icon: FiShoppingCart },
        { id: 'hotels', label: 'Hotels', icon: FiHome },
        { id: 'more', label: 'More', icon: FiMapPin },
    ];

    return (
        // Container adapts padding based on state
        <div className={`px-4 ${isMinimized ? 'pt-1 pb-3' : 'pt-0 pb-3'}`}> {/* Adjust padding */}

            {/* Category Filters - ONLY visible when drawer is minimized */}
            {!isMinimized && (
                // Ensure this section flows correctly and allows scrolling if needed
                <div className="mb-3 flex justify-between items-center space-x-1 overflow-x-auto pb-1 scrollbar-hide"> {/* Added scrollbar-hide utility if using Tailwind extensions */}
                    {categoryFilters.map(filter => (
                        <CategoryChip
                            key={filter.id}
                            icon={filter.icon}
                            label={filter.label}
                            onClick={() => console.log(`Category ${filter.label} clicked`)} // Add actual click handler
                        />
                    ))}
                </div>
            )}

            {/* Search Bar - ALWAYS visible */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search place or address"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent text-sm placeholder-gray-500" // Slightly reduced padding
                    onFocus={onSearchFocus} // Trigger expand (via App.js) when focused
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

        </div>
    );
}

export default SearchAndFilters;