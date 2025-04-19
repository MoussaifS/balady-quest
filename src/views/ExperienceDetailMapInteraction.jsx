import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import SubmissionModal from '../components/SubmissionModal';
import { FiChevronUp, FiHelpCircle, FiCheckSquare, FiCamera,  } from 'react-icons/fi'; // Assuming FiQrCode exists or use another
import { IoQrCode } from "react-icons/io5";

function ExperienceDetailMapInteraction({ experience, progress, onSubmitStep, onExpandRequest }) {
    const [showSubmissionModalForStep, setShowSubmissionModalForStep] = useState(null); // Store the step object

    if (!experience || !progress) {
        return <div className="p-4 text-center text-gray-500">Loading active experience...</div>;
    }

    const isKunuz = experience.type === 'Kunuz';
    const totalSteps = isKunuz ? (experience.steps?.length ?? 0) : (experience.path?.length ?? 0);
    const currentStepIndex = progress.currentStepIndex ?? 0;
    const currentStep = isKunuz ? experience.steps[currentStepIndex] : experience.path[currentStepIndex];

    const handleOpenSubmitModal = () => {
        // Only open for Kunuz steps that require submission
        if (isKunuz && (currentStep.type === 'qa' || currentStep.type === 'qr' || currentStep.type === 'photo')) {
            setShowSubmissionModalForStep(currentStep);
        } else if (isKunuz && currentStep.type === 'location') {
            // Auto-submit location or require manual confirmation? Assume manual for now.
            // For demo, let's just submit location immediately
            onSubmitStep(currentStep.id, { reached: true, coords: 'SIMULATED_COORDS' });
            console.log("Location step reached, auto-submitting (simulation)");
        }
        // For Masarat, maybe just mark as visited? Or no action needed here?
    };

    const handleModalClose = () => {
        setShowSubmissionModalForStep(null);
    };

    const handleModalSubmit = (stepId, submissionData) => {
        onSubmitStep(stepId, submissionData);
        setShowSubmissionModalForStep(null); // Close modal on successful submit
    };

    const getSubmitButtonText = () => {
        if (!isKunuz) return "Next Stop Info"; // Or hide button for Masarat?
        switch (currentStep?.type) {
            case 'location': return "Confirm Location Reached";
            case 'qa': return "Answer Question";
            case 'qr': return "Scan QR Code";
            case 'photo': return "Take Photo";
            default: return "Submit Step";
        }
    };

    const canSubmit = isKunuz && currentStep && !progress.completedSteps?.[currentStep.id];

    return (
        <div className="p-4 pt-1">
            {/* Allow expanding the drawer */}
            <button onClick={onExpandRequest} className="absolute top-1 right-2 text-gray-500 hover:text-cyan-600 p-1">
                <FiChevronUp size={20} />
            </button>

            {/* Progress Bar */}
            <ProgressBar
                currentStep={currentStepIndex} // Show index + 1?
                totalSteps={totalSteps}
                type={experience.type}
                timeRemaining={isKunuz ? progress.timeRemaining : null} // Format this time
                pointsEarned={isKunuz ? progress.points : null}
                totalPoints={isKunuz ? experience.points : null}
            />

            {/* Current Step Info */}
            <div className="mt-4">
                <h5 className="font-semibold text-gray-800 mb-1">
                    Current Stop ({currentStepIndex + 1}/{totalSteps}): {currentStep?.title || `Step ${currentStepIndex + 1}`}
                </h5>
                {isKunuz && currentStep?.hint && (
                    <p className="text-sm text-gray-600 italic flex items-start space-x-1">
                        <FiHelpCircle size={16} className="flex-shrink-0 mt-0.5 text-blue-500"/>
                        <span>Hint: {currentStep.hint}</span>
                    </p>
                )}
                {!isKunuz && currentStep?.description && (
                    <p className="text-sm text-gray-600">{currentStep.description}</p>
                )}
            </div>

            {/* Submit Button (Mainly for Kunuz) */}
            {isKunuz && currentStep && (
                <div className="mt-4">
                    <button
                        onClick={handleOpenSubmitModal}
                        disabled={!canSubmit}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                            canSubmit
                                ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {/* Dynamically choose icon based on step type */}
                        {currentStep.type === 'location' && <FiCheckSquare size={18} />}
                        {currentStep.type === 'qa' && <FiHelpCircle size={18} />}
                        {currentStep.type === 'qr' && <IoQrCode size={18} />}
                        {currentStep.type === 'photo' && <FiCamera size={18} />}
                        <span>{getSubmitButtonText()}</span>
                    </button>
                    {progress.completedSteps?.[currentStep.id] && (
                        <p className="text-green-600 text-xs text-center mt-1">Step Completed!</p>
                    )}
                </div>
            )}

            {/* Submission Modal */}
            {showSubmissionModalForStep && (
                <SubmissionModal
                    step={showSubmissionModalForStep}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    );
}

export default ExperienceDetailMapInteraction;