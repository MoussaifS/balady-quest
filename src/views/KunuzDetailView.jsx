// src/views/KunuzDetailView.js
import React from 'react'; // Removed useState as leaderboard is always visible
import { FiPlay, FiMap, FiAward, FiClock, FiUsers, FiBarChart2, FiStar, FiMapPin, FiHeart, FiCheck } from 'react-icons/fi';
import PlaceholderIcon from '../components/ui/PlaceholderIcon';
import ReviewCard from '../components/ReviewCard'; // Make sure this component exists and works

function KunuzDetailView({ experience, onStart, onViewMap, onToggleFavorite, isFavorite }) {
    const {
        id, title, description, imageUrl, prize, timeLimit, steps,
        difficulty, rating, category, creator, leaderboard = [], reviews = [],
        participants // Destructure participants
    } = experience;

    // Use provided reviews or default message
    const displayReviews = reviews || [];

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Prevent card click if necessary
        onToggleFavorite(id);
    };

    return (
        <div className="pb-24"> {/* Increased padding for two buttons */}

            {/* 1. Image/Video Header */}
            <div className="w-full h-48 sm:h-56 bg-gray-200 relative mb-4">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <PlaceholderIcon className="w-full h-full" />
                )}
                {/* Favorite Button Overlay */}
                <button
                    onClick={handleFavoriteClick}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
                        isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <FiHeart size={20} className={isFavorite ? 'fill-current' : ''} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white text-xl font-semibold drop-shadow-md">{title}</h3>
                    <p className="text-white text-sm opacity-90">{category} - By {creator}</p>
                </div>
            </div>

            {/* 2. Key Info Badges */}
            <div className="px-4 mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="flex items-center bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-full"><FiMapPin size={14} className="mr-1.5" /> {steps?.length ?? 0} Steps</span>
                <span className="flex items-center bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full"><FiClock size={14} className="mr-1.5" /> {timeLimit} Limit</span>
                {/* Show prize indicator */}
                {prize?.text && <span className="flex items-center bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full"><FiAward size={14} className="mr-1.5" /> Prize Available</span>}
                <span className="flex items-center bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full"><FiUsers size={14} className="mr-1.5" /> {difficulty}</span>
                {rating && <span className="flex items-center bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full"><FiStar size={14} className="mr-1.5 fill-current" /> {rating.toFixed(1)}</span>}
                {/* Added Participants Badge */}
                {participants !== undefined && (
                    <span className="flex items-center bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                        <FiUsers size={14} className="mr-1.5" /> {participants.toLocaleString()} Joined
                    </span>
                )}
            </div>

            {/* 3. Description */}
            <div className="px-4 mb-5">
                <h4 className="font-semibold text-lg text-gray-800 mb-1.5">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{description || "No description available."}</p>
            </div>

            {/* 4. Prize Details - Including Icon */}
            {prize?.text && (
                <div className="px-4 mb-5 border-l-4 border-amber-400 pl-3 bg-amber-50/50 py-3 rounded-r-md">
                    <h4 className="font-semibold text-lg text-gray-800 mb-1.5 flex items-center">
                        {prize.icon ? <prize.icon className="mr-2 text-amber-600" size={22}/> : <FiAward className="mr-2 text-amber-600" size={20}/>}
                        Prize Details
                    </h4>
                    <p className="text-gray-700 text-sm">{prize.text}</p>
                </div>
            )}

            {/* 5. Leaderboard - Always Visible */}
            <div className="px-4 mb-5">
                <h4 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                    <FiBarChart2 className="mr-2 text-blue-600" size={20}/> Leaderboard
                </h4>
                <div className="space-y-2 border rounded-lg p-3 bg-gray-50/80 max-h-60 overflow-y-auto">
                    {leaderboard && leaderboard.length > 0 ? leaderboard.map(entry => (
                        <div key={entry.rank} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-600 w-5 text-right">#{entry.rank}</span>
                                <img
                                    src={entry.avatarUrl || '/images/avatars/default-avatar.png'} // Fallback avatar
                                    alt={entry.name}
                                    className="w-7 h-7 rounded-full object-cover border border-gray-300"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/images/avatars/default-avatar.png'; }} // Handle image load error
                                />
                                <span className="font-medium text-gray-800">{entry.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-blue-700 font-semibold block text-xs">{entry.score} pts</span>
                                <span className="text-gray-500 block text-xs">({entry.time})</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm italic text-center py-3">Be the first on the leaderboard!</p>
                    )}
                </div>
            </div>

            {/* 6. Reviews Section */}
            {displayReviews.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2 px-4">Reviews ({displayReviews.length})</h4>
                    {/* Make reviews scrollable horizontally */}
                    <div className="pl-4 pr-2 -mr-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                        <div className="flex space-x-3">
                            {displayReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} className="w-64 flex-shrink-0" /> // Add width and shrink
                            ))}
                            {/* Add padding element to allow scrolling last item fully into view */}
                            <div className="w-4 flex-shrink-0"></div>
                        </div>
                    </div>
                </div>
            )}
            {displayReviews.length === 0 && (
                <div className="px-4 mb-6">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Reviews</h4>
                    <p className="text-gray-500 text-sm italic">No reviews yet. Be the first!</p>
                </div>
            )}


            {/* --- Sticky Start/View Map Buttons --- */}
            <div className="fixed bottom-[50px] left-0 right-0 p-3 bg-white border-t border-gray-200 z-20 flex items-center space-x-3">
                <button
                    onClick={() => onStart(experience)}
                    className="flex-grow flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                    <FiPlay size={20} />
                    {/* TODO: Add logic for "Continue Hunt" if activeQuestProgress exists for this ID */}
                    <span>Start Scavenger Hunt</span>
                </button>
                <button
                    onClick={() => onViewMap(experience)}
                    className="flex-shrink-0 p-3 border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors duration-150"
                    title="View Stops on Map"
                >
                    <FiMap size={20} />
                </button>
            </div>
        </div>
    );
}

export default KunuzDetailView;