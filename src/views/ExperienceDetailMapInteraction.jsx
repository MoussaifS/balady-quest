// src/views/ExperienceDetailMapInteraction.js
import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar'; // Ensure this component exists
import SubmissionModal from '../components/SubmissionModal'; // Ensure this component exists
import { FiChevronUp, FiHelpCircle, FiCheckSquare, FiCamera, FiChevronsUp, FiInfo } from 'react-icons/fi';
import { IoQrCodeOutline } from "react-icons/io5"; // Use outline for consistency
import { AnimatePresence, motion } from 'framer-motion';

function ExperienceDetailMapInteraction({ experience, progress, onSubmitStep, onExpandRequest, onViewDetailsRequest }) {
    const [showSubmissionModalForStep, setShowSubmissionModalForStep] = useState(null);

    if (!experience) {
        return <div className="p-4 text-center text-gray-500">Loading experience...</div>;
    }
    // Handle case where Kunuz is selected but progress hasn't loaded yet
    if (experience.type === 'Kunuz' && !progress) {
        return <div className="p-4 text-center text-gray-500">Loading quest progress...</div>;
    }
    // Handle finished state
    if (progress?.isFinished) {
        return (
            <div className="p-4 pt-1 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} className="flex flex-col items-center">
                    <FiCheckSquare size={40} className="text-green-500 mb-3"/>
                    <h5 className="font-semibold text-lg text-gray-800 mb-1">Quest Complete!</h5>
                    <p className="text-sm text-gray-600 mb-4">You finished {experience.title}. Check your profile for rewards!</p>
                    <button
                        onClick={onViewDetailsRequest} // Go back to detail view
                        className="text-sm text-cyan-600 font-medium hover:underline"
                    >
                        View Summary
                    </button>
                </motion.div>
            </div>
        );
    }


    const isKunuz = experience.type === 'Kunuz';
    const totalSteps = isKunuz ? (experience.steps?.length ?? 0) : (experience.path?.length ?? 0);
    const currentStepIndex = progress?.currentStepIndex ?? 0;
    const currentStep = isKunuz ? experience.steps?.[currentStepIndex] : experience.path?.[currentStepIndex];


    const handleOpenSubmitModal = () => {
        if (isKunuz && currentStep && (currentStep.type === 'qa' || currentStep.type === 'qr' || currentStep.type === 'photo')) {
            setShowSubmissionModalForStep(currentStep);
        }
        // Location step is now handled by App.js validation (removed auto-submit here)
    };

    const handleModalClose = () => {
        setShowSubmissionModalForStep(null);
    };

    const handleModalSubmit = (stepId, submissionData) => {
        onSubmitStep(stepId, submissionData);
        setShowSubmissionModalForStep(null); // Close modal after submission attempt
    };

    const getSubmitButtonText = () => {
        if (!isKunuz || !currentStep) return "View Details"; // Default for Masarat or error
        switch (currentStep.type) {
            case 'qa': return "Answer Question";
            case 'qr': return "Scan QR Code";
            case 'photo': return "Take Photo";
            default: return "Submit Step"; // Fallback
        }
    };

    // Can submit if it's Kunuz, there's a current step, and it's not marked completed in progress state
    const canSubmit = isKunuz && currentStep && !progress?.completedSteps?.[currentStep.id];

    // Icon for the button
    const getSubmitButtonIcon = () => {
        if (!isKunuz || !currentStep) return <FiInfo size={18} />;
        switch (currentStep.type) {
            case 'qa': return <FiHelpCircle size={18} />;
            case 'qr': return <IoQrCodeOutline size={18} />;
            case 'photo': return <FiCamera size={18} />;
            default: return <FiCheckSquare size={18} />;
        }
    }

    return (
        <div className="p-4 pt-1 mb-[50px]">
            {/* Button to expand the drawer for more details */}
            <button onClick={onExpandRequest} className="absolute top-1 right-2 text-gray-500 hover:text-cyan-600 p-1.5 rounded-full hover:bg-gray-100" title="Expand Details">
                <FiChevronsUp size={20} />
            </button>

            {/* Progress Bar */}
            <ProgressBar
                currentStep={currentStepIndex} // Show 0-based index for calculation, display N+1
                totalSteps={totalSteps}
                type={experience.type}
                timeRemaining={isKunuz ? progress?.timeRemaining : null}
                pointsEarned={isKunuz ? progress?.points : null}
                totalPoints={isKunuz ? experience.points : null}
            />

            {/* Current Step Info */}
            <div className="mt-4 min-h-[60px]"> {/* Ensure minimum height */}
                {currentStep ? (
                    <>
                        <h5 className="font-semibold text-gray-800 mb-1 text-base leading-tight">
                            {isKunuz ? `Step ${currentStepIndex + 1}/${totalSteps}` : `Stop ${currentStepIndex + 1}/${totalSteps}: ${currentStep.title}`}
                        </h5>
                        {isKunuz && currentStep.hint && (
                            <p className="text-sm text-gray-600 italic flex items-start space-x-1.5">
                                <FiHelpCircle size={15} className="flex-shrink-0 mt-0.5 text-blue-500"/>
                                <span>{currentStep.hint}</span>
                            </p>
                        )}
                        {!isKunuz && currentStep.description && (
                            <p className="text-sm text-gray-600">{currentStep.description}</p>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 italic">Loading step information...</p>
                )}

            </div>

            {/* Action Button (Submit for Kunuz, Info for Masarat) */}
            <div className="mt-3">
                <button
                    onClick={isKunuz ? handleOpenSubmitModal : onExpandRequest} // Open modal for Kunuz, expand for Masarat
                    disabled={isKunuz && !canSubmit} // Disable only if Kunuz and cannot submit
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-colors text-base ${
                        isKunuz
                            ? (canSubmit ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                            : 'bg-teal-600 text-white hover:bg-teal-700' // Style for Masarat "View Details"
                    }`}
                >
                    {getSubmitButtonIcon()}
                    <span>{getSubmitButtonText()}</span>
                </button>
                {isKunuz && progress?.completedSteps?.[currentStep?.id] && (
                    <p className="text-green-600 text-xs text-center mt-1 animate-pulse">Step Completed!</p>
                )}
            </div>


            {/* Submission Modal */}
            {/* AnimatePresence helps manage the mounting/unmounting animation */}
            <AnimatePresence>
                {showSubmissionModalForStep && (
                    <SubmissionModal
                        key="submission-modal" // Add key for AnimatePresence
                        step={showSubmissionModalForStep}
                        onClose={handleModalClose}
                        onSubmit={handleModalSubmit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default ExperienceDetailMapInteraction;