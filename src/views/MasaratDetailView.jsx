import React from 'react';
import { FiPlay, FiMap, FiClock, FiStar, FiMapPin, FiCompass, FiImage } from 'react-icons/fi';
import PlaceholderIcon from '../components/ui/PlaceholderIcon';
import ReviewCard from '../components/ReviewCard'; // Assuming reviews might apply here too

function MasaratDetailView({ experience, onStart, onViewMap }) {
    const { title, description, imageUrl, estimatedDuration, path, difficulty, rating, category, creator, reviews = [] } = experience;

    // Dummy reviews if not in mock data yet
    const displayReviews = reviews.length > 0 ? reviews : [
        { id: 'r3', user: 'Sara B.', rating: 4, text: "Lovely walk, very informative points.", media: [] },
        { id: 'r4', user: 'Omar K.', rating: 5, text: "Perfect for a weekend afternoon. Well planned.", media: [] },
    ];

    return (
        <div className="pb-20"> {/* Padding for sticky button */}

            {/* 1. Image Header */}
            <div className="w-full h-48 sm:h-56 bg-gray-200 relative mb-4">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <PlaceholderIcon className="w-full h-full" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-white text-xl font-semibold drop-shadow-md">{title}</h3>
                    <p className="text-white text-sm opacity-90">{category} - By {creator}</p>
                </div>
            </div>

            {/* 2. Key Info Badges */}
            <div className="px-4 mb-4 flex flex-wrap gap-3 text-sm">
                <span className="flex items-center bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full"><FiMapPin size={14} className="mr-1.5" /> {path?.length ?? 0} Stops</span>
                <span className="flex items-center bg-green-100 text-green-800 px-2.5 py-1 rounded-full"><FiClock size={14} className="mr-1.5" /> ~{estimatedDuration}</span>
                <span className="flex items-center bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full"><FiCompass size={14} className="mr-1.5" /> {difficulty}</span>
                {rating && <span className="flex items-center bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full"><FiStar size={14} className="mr-1.5 fill-current" /> {rating.toFixed(1)}</span>}
            </div>

            {/* 3. Description */}
            <div className="px-4 mb-5">
                <h4 className="font-semibold text-lg text-gray-800 mb-1.5">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{description || "No description available."}</p>
            </div>

            {/* 4. Path/Stops Preview */}
            <div className="px-4 mb-5">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Experience Stops</h4>
                <div className="space-y-3">
                    {path && path.map((stop, index) => (
                        <div key={stop.id} className="flex items-start space-x-3 p-2 border rounded-lg bg-gray-50">
                            <span className="flex-shrink-0 mt-1 w-6 h-6 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{index + 1}</span>
                            <div className="flex-grow">
                                <h5 className="font-medium text-sm text-gray-800">{stop.title}</h5>
                                <p className="text-xs text-gray-600">{stop.description}</p>
                            </div>
                            {stop.imageUrl ? (
                                <img src={stop.imageUrl} alt={stop.title} className="w-12 h-12 rounded object-cover flex-shrink-0"/>
                            ) : (
                                <div className="w-12 h-12 rounded bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                                    <FiImage size={20}/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Reviews Section (Optional) */}
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
                    className="flex-grow flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150"
                >
                    <FiPlay size={20} />
                    <span>Start Experience</span>
                </button>
                <button
                    onClick={() => onViewMap(experience)}
                    className="flex-shrink-0 p-3 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-150"
                    title="View Path on Map"
                >
                    <FiMap size={20} />
                </button>
            </div>
        </div>
    );
}

export default MasaratDetailView;