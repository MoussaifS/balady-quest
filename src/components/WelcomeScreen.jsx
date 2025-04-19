// src/components/WelcomeScreen.js
import React from 'react';
// Import your desired welcome image
// Make sure this image exists in your project (e.g., in src/assets)
// or use a direct URL string.

function WelcomeScreen({ onStart }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black cursor-pointer"
            onClick={onStart}
            style={{
                backgroundImage: `url(/images/masart.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            aria-label="Tap to start"
            role="button"
        >
            {/* Optional: Add a subtle text overlay if needed */}
            {/* <p className="text-white text-2xl font-bold bg-black bg-opacity-50 p-4 rounded">
        Tap to Begin Your Adventure
      </p> */}
        </div>
    );
}

export default WelcomeScreen;