import React from 'react';
import { FiStar, FiMapPin, FiUsers, FiClock, FiAward, FiCheckSquare, FiPlay, FiBookmark, FiShare2, FiHeart } from 'react-icons/fi';
import PlaceholderIcon from './ui/PlaceholderIcon';

function ExperienceCard({ experience, onClick, onToggleFavorite, isFavorite }) {
    const {
        id, type, imageUrl, title, rating, creator, category, // Common
        timeLimit, prize, status, // Kunuz specific
        estimatedDuration, path // Masarat specific
    } = experience;

    const isKunuz = type === 'Kunuz';
    const placesCount = isKunuz ? (experience.steps?.length ?? 0) : (path?.length ?? 0);

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking favorite
        onToggleFavorite(id);
    };

    const handleShareClick = (e) => {
        e.stopPropagation();
        console.log("Share experience:", id); // Placeholder for share functionality
        // Navigator.share API can be used here
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <span className="absolute top-1.5 left-1.5 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ACTIVE</span>;
            case 'upcoming': return <span className="absolute top-1.5 left-1.5 bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">UPCOMING</span>;
            case 'finished': return <span className="absolute top-1.5 left-1.5 bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">FINISHED</span>;
            default: return null;
        }
    };

    return (
        <div
            onClick={() => onClick(experience)} // Pass the whole experience object
            className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-150 ease-in-out cursor-pointer active:bg-gray-50 relative" // Added relative positioning
        >
            {/* Status Badge for Kunuz */}
            {isKunuz && getStatusBadge(status)}

            {/* Image Section */}
            <div className="flex-shrink-0 w-28 sm:w-32 m-1.5 rounded-lg overflow-hidden relative">
                {imageUrl ? (
                    <img
                        src={imageUrl} // Assume placeholders are set up
                        alt={title}
                        className="w-full h-full object-cover min-h-[140px]" // Ensure image covers space
                    />
                ) : (
                    <PlaceholderIcon className="w-full h-full min-h-[140px]" />
                )}
                {/* Type Indicator (Optional) */}
                <span className={`absolute bottom-1 right-1 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded ${isKunuz ? 'bg-cyan-600' : 'bg-teal-600'}`}>
                    {type}
                </span>
            </div>

            {/* Content Section */}
            <div className="flex-grow p-3 pr-10 flex flex-col justify-between"> {/* Added pr-10 for buttons */}
                <div>
                    <p className="text-xs text-cyan-700 font-medium mb-0.5">{category} - {creator}</p>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm leading-snug line-clamp-2">{title}</h3>
                </div>

                {/* Icons Row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
                    {rating && (
                        <span className="flex items-center"><FiStar className="w-3 h-3 text-yellow-500 mr-0.5 fill-current" /> {rating.toFixed(1)}</span>
                    )}
                    <span className="flex items-center"><FiMapPin className="w-3 h-3 mr-0.5" /> {placesCount} {placesCount === 1 ? 'Stop' : 'Stops'}</span>
                    {/* Kunuz Specific Icons */}
                    {isKunuz && timeLimit && (
                        <span className="flex items-center"><FiClock className="w-3 h-3 mr-0.5" /> {timeLimit}</span>
                    )}
                    {isKunuz && prize && (
                        <span className="flex items-center"><FiAward className="w-3 h-3 mr-0.5 text-amber-600" /> Prize</span>
                    )}
                    {/* Masarat Specific Icons */}
                    {!isKunuz && estimatedDuration && (
                        <span className="flex items-center"><FiClock className="w-3 h-3 mr-0.5" /> ~{estimatedDuration}</span>
                    )}
                </div>
            </div>

            {/* Action Buttons (Top Right) */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1.5">
                <button
                    onClick={handleFavoriteClick}
                    className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <FiHeart size={16} className={isFavorite ? 'fill-current' : ''}/>
                </button>
                <button
                    onClick={handleShareClick}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    aria-label="Share Experience"
                >
                    <FiShare2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default ExperienceCard;