// src/components/SearchAndFilters.js
import React from 'react';
import { FiSearch, FiBookmark, FiNavigation, FiCoffee, FiShoppingCart, FiHome, FiSliders, FiMapPin } from 'react-icons/fi'; // Added FiSliders

// Simple Chip for Categories (Can be styled further)
function CategoryChip({ icon: Icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            // Adjusted styling for a cleaner look in the context
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
            {Icon && <Icon size={14} className='opacity-80' />}
            <span>{label}</span>
        </button>
    );
}


function SearchAndFilters({ isMinimized, onSearchFocus }) {

    // Example categories - might want to move this to App state or config
    const categoryFilters = [
        { id: 'saved', label: 'Saved', icon: FiBookmark },
        { id: 'eat', label: 'Eat', icon: FiCoffee },
        { id: 'shops', label: 'Shops', icon: FiShoppingCart },
        { id: 'parks', label: 'Parks', icon: FiMapPin }, // Example
        { id: 'services', label: 'Services', icon: FiHome }, // Example
        // Add more or fetch dynamically
    ];

    return (
        // Container adjusts padding - No Search bar padding when expanded list view
        <div className={`px-4 pb-3 ${isMinimized ? 'pt-1' : 'pt-0'}`}>

            {/* --- Show Categories ONLY when drawer is MINIMIZED and in INITIAL view --- */}
            {/* This section is now controlled by the parent (InteractiveDrawer) based on view state */}
            {/* If you wanted specific categories here vs list view, you'd need different logic */}


            {/* Search Bar - Always visible when this component is rendered */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search place or address"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm placeholder-gray-500 transition-shadow focus:shadow-md"
                    onFocus={onSearchFocus}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                {/* Optional: Add a filter button next to search */}
                {/* <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-cyan-600">
                     <FiSliders size={18} />
                 </button> */}
            </div>

        </div>
    );
}

export default SearchAndFilters;