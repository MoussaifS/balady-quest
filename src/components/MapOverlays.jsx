import React from 'react';
import { FiLayers, FiPlus, FiMinus, FiNavigation, FiCloud } from 'react-icons/fi'; // Using FiCloud for weather

function MapOverlays() {
  return (
    <>
      {/* Top Left Overlay (Weather - example) */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow flex items-center space-x-1 text-sm z-20">         <FiCloud className="text-orange-400" />
        <span>22°</span>
      </div>

      {/* Right Side Overlays */}
      <div className="absolute top-16 right-4 flex flex-col space-y-2">
        <button className="bg-white p-3 rounded-lg shadow text-gray-700 hover:bg-gray-100">
          <FiLayers size={20} />
        </button>
        {/* Add Traffic Button if needed */}
        {/* <button className="bg-white p-3 rounded-lg shadow text-gray-700 hover:bg-gray-100">
          <FiTrafficCone size={20} /> // Example Icon
        </button> */}
      </div>

      <div className="absolute top-48 right-4 flex flex-col space-y-2">
         <button className="bg-white p-3 rounded-t-lg shadow text-gray-700 hover:bg-gray-100 border-b border-gray-200">
          <FiPlus size={20} />
        </button>
        <button className="bg-white p-3 rounded-b-lg shadow text-gray-700 hover:bg-gray-100">
          <FiMinus size={20} />
        </button>
      </div>


      <div className="absolute bottom-[200px] right-4 flex flex-col space-y-2">
         {/* Adjust 'bottom' based on final drawer height */}
        <button className="bg-blue-500 p-3 rounded-full shadow text-white hover:bg-blue-600">
             <svg // Play Button SVG - replace if needed
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/>
             </svg>
        </button>
         <button className="bg-white p-3 rounded-full shadow text-gray-700 hover:bg-gray-100">
           <FiNavigation size={20} className="transform -rotate-45"/>
        </button>
      </div>
    </>
  );
}

export default MapOverlays;