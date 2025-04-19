import React from 'react';

function FilterChip({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out whitespace-nowrap ${
        isActive
          ? 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-300' // Active state styling
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Inactive state
      }`}
    >
      {Icon && <Icon size={16} className={isActive ? 'text-cyan-600' : 'text-gray-500'} />}
      <span>{label}</span>
    </button>
  );
}

export default FilterChip;