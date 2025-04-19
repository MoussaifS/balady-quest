// src/components/SubmissionModal.js
import React, { useState, useEffect } from 'react';
import { FiCamera, FiCheck, FiX, FiHelpCircle } from 'react-icons/fi';
import { IoQrCodeOutline } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion'; // Import motion

// --- Placeholder Components (Keep or replace with actual implementations) ---
const QrScannerPlaceholder = ({ onScan }) => (
    // ... (keep existing implementation or replace)
    <div className="w-full h-48 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-400 mb-3 border border-gray-700">
        <IoQrCodeOutline size={60} />
        <p className="mt-2 text-sm">QR Scanner Area</p>
        <button
            onClick={() => onScan(prompt("Enter Mock QR Value:", 'BALADYJEDDAHSECRET1'))} // Simulate scan with prompt
            className="mt-3 bg-cyan-600 text-white px-3 py-1 rounded text-xs hover:bg-cyan-700"
        >
            Simulate Scan
        </button>
    </div>
);
const CameraPlaceholder = ({ onCapture }) => (
    // ... (keep existing implementation or replace)
    <div className="w-full h-48 bg-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 mb-3 border border-gray-400">
        <FiCamera size={60} />
        <p className="mt-2 text-sm">Camera View Area</p>
        <button
            onClick={() => onCapture('SIMULATED_IMAGE_DATA_' + Date.now())} // Simulate capture
            className="mt-3 bg-cyan-600 text-white px-3 py-1 rounded text-xs hover:bg-cyan-700"
        >
            Simulate Capture
        </button>
    </div>
);
// --- End Placeholder Components ---


function SubmissionModal({ step, onClose, onSubmit }) {
    const [answer, setAnswer] = useState('');
    const [scannedData, setScannedData] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset local state if step changes (though modal usually closes)
    useEffect(() => {
        setAnswer('');
        setScannedData(null);
        setCapturedImage(null);
        setIsSubmitting(false);
    }, [step]);

    const handleSubmit = async () => {
        setIsSubmitting(true); // Indicate loading/processing
        let submissionData = null;
        if (step.type === 'qa') {
            submissionData = answer;
        } else if (step.type === 'qr') {
            submissionData = scannedData;
        } else if (step.type === 'photo') {
            submissionData = capturedImage;
        }

        try {
            // Simulate potential async operation
            // await new Promise(resolve => setTimeout(resolve, 500));
            onSubmit(step.id, submissionData); // Pass step ID and the data
            // No need to close here, App.js handles state change which triggers close or next step
        } catch (error) {
            console.error("Submission error:", error);
            // Handle submission error feedback if needed
        } finally {
            // setIsSubmitting(false); // Usually modal closes before this matters
        }
    };

    // Determine if submit button should be enabled
    const canSubmit = () => {
        if (isSubmitting) return false;
        if (step.type === 'qa') return answer.trim().length > 0;
        if (step.type === 'qr') return !!scannedData;
        if (step.type === 'photo') return !!capturedImage;
        return false; // Default to disabled if type unknown
    };

    const renderContent = () => {
        switch (step.type) {
            case 'qa':
                return (
                    <div>
                        <label htmlFor="qa-answer" className="block text-sm font-medium text-gray-700 mb-1">
                            {step.question || "Enter your answer:"}
                        </label>
                        <textarea
                            id="qa-answer"
                            rows="3"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                            placeholder="Your answer here..."
                        />
                    </div>
                );
            case 'qr':
                return (
                    <div>
                        <p className="text-sm text-gray-700 mb-2">{step.hint || "Scan the required QR code."}</p>
                        <QrScannerPlaceholder onScan={setScannedData} />
                        {scannedData && (
                            <p className="text-green-600 text-xs mt-1 bg-green-50 p-1 rounded border border-green-200 break-all">
                                <FiCheck size={12} className="inline mr-1" /> Scanned: {scannedData}
                            </p>
                        )}
                    </div>
                );
            case 'photo':
                return (
                    <div>
                        <p className="text-sm text-gray-700 mb-2">{step.photoPrompt || "Take the required photo."}</p>
                        <CameraPlaceholder onCapture={setCapturedImage}/>
                        {capturedImage && (
                            <p className="text-green-600 text-xs mt-1 bg-green-50 p-1 rounded border border-green-200">
                                <FiCheck size={12} className="inline mr-1" /> Image captured (simulation)
                            </p>
                        )}
                    </div>
                );
            default:
                return <p className="text-red-500 text-sm">Error: Unknown submission type for this step!</p>;
        }
    };

    return (
        // AnimatePresence is handled in the parent component (ExperienceDetailMapInteraction)
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={onClose} // Close on backdrop click
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                    disabled={isSubmitting}
                >
                    <FiX size={20} />
                </button>

                <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center">
                    {step.type === 'qa' && <FiHelpCircle className="mr-2 text-blue-500" />}
                    {step.type === 'qr' && <IoQrCodeOutline className="mr-2 text-purple-500" />}
                    {step.type === 'photo' && <FiCamera className="mr-2 text-orange-500" />}
                    Submit Answer/Scan/Photo
                </h3>
                <p className="text-xs text-gray-500 mb-4">For Step {step.id?.slice(-3)}</p> {/* Show partial ID */}

                <div className="mb-5 max-h-[60vh] overflow-y-auto p-1 -m-1">
                    {renderContent()}
                </div>


                <div className="mt-5 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        type="button"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        disabled={!canSubmit() || isSubmitting}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center justify-center space-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors ${
                            canSubmit() && !isSubmitting ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <FiCheck size={18} />
                        )}
                        <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default SubmissionModal;