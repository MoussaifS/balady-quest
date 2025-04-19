import React from 'react';
import { FiStar, FiMapPin, FiUsers } from 'react-icons/fi'; // Example icons

function QuestCard({ imageUrl, title, rating, places, joined }) {
  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-150 ease-in-out">
      {/* Image Section */}
      <div className="flex-shrink-0 w-24 sm:w-28">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
            <FiMapPin size={24} /> {/* Placeholder icon */}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1 text-base leading-snug">{title}</h3>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500 mt-2">
          {rating !== undefined && rating !== null && (
            <span className="flex items-center">
              <FiStar className="w-3.5 h-3.5 text-yellow-500 mr-0.5" />
              {rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center">
            <FiMapPin className="w-3.5 h-3.5 mr-0.5" />
            {places} {places === 1 ? 'Place' : 'Places'}
          </span>
          <span className="flex items-center">
            <FiUsers className="w-3.5 h-3.5 mr-0.5" />
            {joined} Joined
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuestCard;