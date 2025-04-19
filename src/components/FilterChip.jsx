import React from 'react';

// This is for the filters within the EXPANDED drawer (e.g., Culture, Parks)
function FilterChip({ icon: Icon, label, isActive, onClick }) {
  return (
      <button
          onClick={onClick}
          className={`flex-shrink-0 flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out whitespace-nowrap border ${
              isActive
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-700' // Active state styling
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 hover:border-gray-300' // Inactive state
          }`}
      >
        {Icon && <Icon size={16} className={isActive ? 'text-cyan-600' : 'text-gray-500'} />}
        <span>{label}</span>
      </button>
  );
}

export default FilterChip;