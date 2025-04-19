// src/components/RewardModal.js
import React from 'react';
import { FiAward, FiX, FiGift } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function RewardModal({ prize, onClose }) {
    const IconComponent = prize?.icon || FiGift; // Fallback icon

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4" // Ensure high z-index
                onClick={onClose} // Close on backdrop click
            >
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative text-center"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                >
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <FiX size={22} />
                    </button>

                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                        <IconComponent size={40} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
                    <p className="text-gray-600 mb-5">You've successfully completed the challenge!</p>

                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 mb-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">You've earned:</p>
                        <p className="text-lg font-semibold text-cyan-700">{prize?.text || 'Experience Points!'}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                        Awesome!
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default RewardModal;