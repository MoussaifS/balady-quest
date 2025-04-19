import React from 'react';
import { FiImage } from 'react-icons/fi'; // Or any default icon

const PlaceholderIcon = ({ size = 24, className = '' }) => {
    return (
        <div className={`flex items-center justify-center bg-gray-200 rounded ${className}`}>
            <FiImage className="text-gray-400" size={size} />
        </div>
    );
};

export default PlaceholderIcon;