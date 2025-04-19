import React from 'react';
import { FiZap, FiSearch, FiX } from 'react-icons/fi';

function ExperienceSelectionModal({ onSelect, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                    aria-label="Close"
                >
                    <FiX size={20} />
                </button>

                <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Choose Your Adventure!</h2>

                <div className="space-y-4">
                    <button
                        onClick={() => onSelect('Kunuz')}
                        className="w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-5 px-4 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
                    >
                        <FiSearch size={28} />
                        <span className="text-lg">Kunuz (Scavenger Hunt)</span>
                        <span className="text-xs opacity-90">Solve clues, race time, win prizes!</span>
                    </button>

                    <button
                        onClick={() => onSelect('Masarat')}
                        className="w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white font-semibold py-5 px-4 rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
                    >
                        <FiZap size={28} />
                        <span className="text-lg">Masarat (Explore Track)</span>
                        <span className="text-xs opacity-90">Follow curated paths, discover points of interest.</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExperienceSelectionModal;