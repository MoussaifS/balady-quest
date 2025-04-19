// src/components/StepCompletionPopup.js
import React, { useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function StepCompletionPopup({ message, isVisible, onDismiss }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 3000); // Auto-dismiss after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onDismiss]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-auto max-w-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl z-[200] flex items-center space-x-3" // High z-index
                >
                    <FiCheckCircle size={20} />
                    <span className="text-sm font-medium">{message}</span>
                    <button onClick={onDismiss} className="ml-auto p-1 -mr-1 text-green-100 hover:text-white">
                        <FiX size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default StepCompletionPopup;