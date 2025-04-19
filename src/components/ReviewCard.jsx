import React from 'react';
import { FiStar, FiUser, FiCamera, FiFilm } from 'react-icons/fi';

function ReviewCard({ review }) {
  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; // Check for decimal

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={`full-${i}`} className="w-3.5 h-3.5 text-yellow-500 fill-current" />);
    }
    // Add half star if needed (logic can be more complex for actual half stars)
    // if (hasHalfStar) { stars.push(<FiStar key="half" className="w-3.5 h-3.5 text-yellow-500 opacity-50 fill-current" />); }

    const emptyStars = 5 - Math.ceil(rating); // Calculate remaining empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FiStar key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-sm p-3">
      {/* User Info & Rating */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <FiUser size={14}/> {/* Replace with user avatar if available */}
          </div>
          <span className="text-sm font-medium text-gray-700">{review.user}</span>
        </div>
        <div className="flex items-center space-x-0.5">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-xs text-gray-600 leading-normal mb-2">{review.text}</p>

      {/* Media Placeholders (Optional) */}
      {review.media && review.media.length > 0 && (
        <div className="flex space-x-1.5 overflow-x-auto">
          {review.media.map((mediaUrl, index) => (
            <div key={index} className="flex-shrink-0 w-16 h-12 rounded bg-gray-300 flex items-center justify-center">
              {/* Placeholder - Check if URL is image or video */}
              {mediaUrl.includes('placeholder') ? // Simple check for placeholder
                <FiCamera size={18} className="text-gray-500"/> :
                <FiFilm size={18} className="text-gray-500"/>
              }
              {/* In real app, show thumbnail: <img src={mediaUrl} className="w-full h-full object-cover rounded"/> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;