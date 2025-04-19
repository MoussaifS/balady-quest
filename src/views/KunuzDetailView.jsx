import React, { useState } from 'react';
import { FiPlay, FiMap, FiAward, FiClock, FiUsers, FiBarChart2, FiStar, FiMapPin } from 'react-icons/fi';
import PlaceholderIcon from '../components/ui/PlaceholderIcon';
import ReviewCard from '../components/ReviewCard'; // Assuming reviews are added to mock data

function KunuzDetailView({ experience, onStart, onViewMap }) {
    const { title, description, imageUrl, prize, timeLimit, steps, difficulty, rating, category, creator, leaderboard = [], reviews = [] } = experience;
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Dummy reviews if not in mock data yet
    const displayReviews = reviews.length > 0 ? reviews : [
        { id: 'r1', user: 'Ali M.', rating: 5, text: "So much fun! The clues were challenging but fair.", media: [] },
        { id: 'r2', user: 'Noor H.', rating: 4, text: "Great way to explore the area. Wish there was a bit more time.", media: ['/images/placeholder-review.png'] },
    ];

    return (
        <div className="pb-20"> {/* Padding at bottom for sticky button */}

            {/* 1. Image/Video Header */}
            <div className="w-full h-48 sm:h-56 bg-gray-200 relative mb-4">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <PlaceholderIcon className="w-full h-full" />
                )}
                {/* You could add an overlay play button for video */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white text-xl font-semibold drop-shadow-md">{title}</h3>
                    <p className="text-white text-sm opacity-90">{category} - By {creator}</p>
                </div>
            </div>

            {/* 2. Key Info Badges */}
            <div className="px-4 mb-4 flex flex-wrap gap-3 text-sm">
                <span className="flex items-center bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-full"><FiMapPin size={14} className="mr-1.5" /> {steps?.length ?? 0} Steps</span>
                <span className="flex items-center bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full"><FiClock size={14} className="mr-1.5" /> {timeLimit} Limit</span>
                <span className="flex items-center bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full"><FiAward size={14} className="mr-1.5" /> {prize?.text ? 'Prize Available' : 'Points Only'}</span>
                <span className="flex items-center bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full"><FiUsers size={14} className="mr-1.5" /> {difficulty}</span>
                {rating && <span className="flex items-center bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full"><FiStar size={14} className="mr-1.5 fill-current" /> {rating.toFixed(1)}</span>}
            </div>

            {/* 3. Description */}
            <div className="px-4 mb-5">
                <h4 className="font-semibold text-lg text-gray-800 mb-1.5">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{description || "No description available."}</p>
            </div>

            {/* 4. Prize Details */}
            {prize?.text && (
                <div className="px-4 mb-5">
                    <h4 className="font-semibold text-lg text-gray-800 mb-1.5 flex items-center"><FiAward className="mr-2 text-amber-600" size={20}/>Prize Details</h4>
                    <p className="text-gray-700 text-sm">{prize.text}</p>
                </div>
            )}

            {/* 5. Leaderboard Toggle & Content */}
            <div className="px-4 mb-5">
                <button
                    onClick={() => setShowLeaderboard(!showLeaderboard)}
                    className="flex items-center justify-between w-full text-left font-semibold text-lg text-gray-800 mb-2 p-2 rounded hover:bg-gray-100"
                >
                    <span className="flex items-center"><FiBarChart2 className="mr-2 text-blue-600" size={20}/> Leaderboard</span>
                    {/* Add Chevron Icon */}
                </button>
                {showLeaderboard && (
                    <div className="pl-2 pr-2 space-y-2 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
                        {leaderboard && leaderboard.length > 0 ? leaderboard.map(entry => (
                            <div key={entry.rank} className="flex justify-between items-center text-sm p-1 border-b last:border-b-0">
                                <span className="font-medium">#{entry.rank} {entry.name}</span>
                                <span className="text-gray-600">{entry.score} pts ({entry.time})</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm italic text-center py-2">No leaderboard data yet.</p>
                        )}
                    </div>
                )}
            </div>

            {/* 6. Reviews Section (Optional but good) */}
            {displayReviews.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2 px-4">Reviews ({displayReviews.length})</h4>
                    <div className="pl-4 pr-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                        <div className="flex space-x-3">
                            {displayReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* --- Sticky Start Button --- */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10 flex items-center space-x-3">
                <button
                    onClick={() => onStart(experience)}
                    className="flex-grow flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150"
                >
                    <FiPlay size={20} />
                    {/* TODO: Check if already started, change text to "Continue Hunt" */}
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