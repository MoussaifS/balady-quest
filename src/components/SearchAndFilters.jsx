import React from 'react';
import { FiSearch, FiBookmark, FiNavigation, FiCoffee, FiShoppingCart, FiHome } from 'react-icons/fi';

function SearchAndFilters() {
  return (
    <div className="px-4 pt-4 pb-2 bg-white">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search place or address"
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Filter Chips */}
      <div className="mt-3 flex space-x-2 overflow-x-auto pb-1">
        <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          <FiBookmark size={16} />
          <span>Saved</span> {/* Assuming the bookmark icon means Saved */}
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          <FiNavigation size={16} />
          <span>Go</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          <FiCoffee size={16} />
          <span>Eat out</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          <FiShoppingCart size={16} />
          <span>Markets</span>
        </button>
         <button className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
          <FiHome size={16} />
          <span>Hotels</span>
        </button>
         {/* Add more filters as needed */}
      </div>
    </div>
  );
}

export default SearchAndFilters;