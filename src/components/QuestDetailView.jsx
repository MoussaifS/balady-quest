import React from 'react';
import ReviewCard from './ReviewCard'; // We'll create this next
import { FiPlayCircle, FiCompass, FiZap } from 'react-icons/fi'; // Example icons

function QuestDetailView({ quest }) { // Removed onBack, handled in header now
  if (!quest) return null; // Should not happen if logic is correct, but good practice

  return (
    <div className="flex flex-col h-full"> {/* Takes full height of its container */}

      {/* 1. Video/Image Placeholder */}
      <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white mb-4 relative">
        {/* You could embed a video player or show quest.imageUrl here */}
        <FiPlayCircle size={60} className="opacity-70" />
        {/* Overlay Title (Optional) */}
         {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
             <h3 className="text-white text-xl font-semibold">{quest.title}</h3>
         </div> */}
      </div>

      {/* 2. Description */}
      <div className="px-4 mb-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-1.5">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{quest.description || "No description available."}</p>
      </div>

      {/* 3. Reviews Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 px-4">Reviews ({quest.reviews?.length || 0})</h3>
        {quest.reviews && quest.reviews.length > 0 ? (
          <div className="pl-4 pr-2 overflow-x-auto whitespace-nowrap pb-2"> {/* Horizontal Scroll */}
             <div className="flex space-x-3">
                {quest.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm px-4 italic">No reviews yet.</p>
        )}
      </div>


       {/* 4. Action Buttons (Fixed or near bottom) */}
       {/* Place these inside the main div to scroll with content */}
       <div className="px-4 mt-auto pb-4 space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150">
                <FiCompass size={20} />
                <span>Scavenger Hunt Mode</span>
            </button>
             <button className="w-full flex items-center justify-center space-x-2 border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 font-semibold py-3 px-4 rounded-lg transition-colors duration-150">
                 <FiZap size={20} />
                 <span>Experience Mode</span>
             </button>
        </div>

    </div>
  );
}

export default QuestDetailView;