import React from 'react';
import { FiStar, FiMapPin, FiUsers } from 'react-icons/fi';

function QuestCard({ imageUrl, title, rating, places, joined, onClick }) {
    return (
        <div
            onClick={onClick} // Make sure onClick is passed if needed here too
            className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-150 ease-in-out cursor-pointer active:bg-gray-50"
        >
            {/* Image Section */}
            <div className="flex-shrink-0 w-24 sm:w-28 m-1 p-0.5 border-2 border-blue-950 rounded-xl overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-[100px] h-[140px] object-cover rounded-lg overflow-hidden"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <FiMapPin size={24} /> {/* Placeholder icon */}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-grow p-3 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-snug">{title}</h3>
                </div>
                <div className="flex flex-col gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
                    {rating !== undefined && rating !== null && (
                        <span className="flex items-center">
              <FiStar className="w-3.5 h-3.5 text-yellow-500 mr-0.5 fill-current" /> {/* Fill star */}
                            {rating.toFixed(1)}
            </span>
                    )}
                    <span className="flex items-center">
            <FiMapPin className="w-3.5 h-3.5 mr-0.5" />
                        {places} {places === 1 ? 'Place' : 'Places'}
          </span>
                    <span className="flex items-center">
            <FiUsers className="w-3.5 h-3.5 mr-0.5" />
                        {joined?.toLocaleString() ?? 'N/A'} Joined {/* Format large numbers */}
          </span>
                </div>
            </div>
        </div>
    );
}

export default QuestCard;