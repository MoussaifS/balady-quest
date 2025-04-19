// src/App.js
import React, { useState, useCallback, useEffect } from 'react';
import MapView from './components/MapView';
import InteractiveDrawer from './components/InteractiveDrawer';
import BottomNavigationBar from './components/BottomNavigationBar';
import ExperienceSelectionModal from './components/ExperienceSelectionModal';
import RewardModal from './components/RewardModal'; // <-- Import Reward Modal
import StepCompletionPopup from './components/StepCompletionPopup'; // <-- Import Step Popup

// Import Mock Data
import { mockExperiences, mockUserProfile } from './data/mockData';

const BOTTOM_NAV_HEIGHT = 56;
const MINIMIZED_DRAWER_PEEK_HEIGHT = 130;

// --- useFavorites Hook (Keep as is) ---
const useFavorites = (initialFavorites = []) => {
    const [favoriteIds, setFavoriteIds] = useState(new Set(initialFavorites));
    const toggleFavorite = useCallback((experienceId) => {
        setFavoriteIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(experienceId)) {
                newSet.delete(experienceId);
            } else {
                newSet.add(experienceId);
            }
            // Add localStorage persistence if needed
            return newSet;
        });
    }, []);
    useEffect(() => {
        setFavoriteIds(new Set(mockUserProfile.savedExperiences || []));
    }, []);
    return [favoriteIds, toggleFavorite];
};

// --- Main App Component ---
function App() {
    // --- Core State ---
    const [isDrawerMinimized, setIsDrawerMinimized] = useState(true);
    const [currentView, setCurrentView] = useState('initial');
    const [showInitialModal, setShowInitialModal] = useState(true);
    const [selectedExperienceType, setSelectedExperienceType] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [activeBottomTab, setActiveBottomTab] = useState('Explore');

    // --- Mock Data State ---
    const [experiencesData, setExperiencesData] = useState(mockExperiences);
    const [userProfileData, setUserProfileData] = useState(mockUserProfile);
    const [favoriteExperienceIds, toggleFavorite] = useFavorites(userProfileData.savedExperiences);

    // --- Active Quest State ---
    const [activeQuestProgress, setActiveQuestProgress] = useState(null);

    // --- UI Feedback State ---
    const [stepCompletionMessage, setStepCompletionMessage] = useState(''); // For the popup
    const [showRewardModal, setShowRewardModal] = useState(false); // For final reward


    // --- Handlers ---
    const handleMapClick = useCallback(() => {
        if (!isDrawerMinimized && currentView !== 'mapInteraction') {
            setIsDrawerMinimized(true);
        }
    }, [isDrawerMinimized, currentView]);

    const handleExpandRequest = useCallback(() => {
        if (isDrawerMinimized) {
            setIsDrawerMinimized(false);
        }
    }, [isDrawerMinimized]);

    const handleMinimizeRequest = useCallback(() => {
        if (!isDrawerMinimized) {
            setIsDrawerMinimized(true);
        }
    }, [isDrawerMinimized]);

    const handleSearchFocus = useCallback(() => {
        if (isDrawerMinimized) {
            setIsDrawerMinimized(false);
            if (currentView !== 'list') { // Switch to list if not already there
                setCurrentView('list');
                if (!selectedExperienceType) setSelectedExperienceType('Kunuz'); // Default if needed
                setActiveBottomTab('Experiences');
            }
        }
    }, [isDrawerMinimized, currentView, selectedExperienceType]);

    const handleInitialSelection = (type) => {
        setSelectedExperienceType(type);
        setCurrentView('list');
        setShowInitialModal(false);
        setIsDrawerMinimized(false);
        setActiveBottomTab('Experiences');
    };

    const handleCloseInitialModal = () => {
        setShowInitialModal(false);
        setCurrentView('map');
        setIsDrawerMinimized(true);
        setActiveBottomTab('Explore');
    };

    const handleExperienceSelect = useCallback((experience) => {
        setSelectedExperience(experience);
        setCurrentView('detail');
        setIsDrawerMinimized(false);
        setActiveQuestProgress(null); // Clear any previous active progress
        setStepCompletionMessage(''); // Clear any lingering messages
        setShowRewardModal(false);
    }, []);

    const handleBackToList = useCallback(() => {
        setSelectedExperience(null);
        setCurrentView('list');
        setIsDrawerMinimized(false); // Keep drawer expanded for list
        setActiveQuestProgress(null);
        setStepCompletionMessage('');
        setShowRewardModal(false);
    }, []);

    // --- Start Experience ---
    const handleStartExperience = useCallback((experience) => {
        console.log("Starting experience:", experience.id);
        setSelectedExperience(experience);
        setCurrentView('mapInteraction');
        setIsDrawerMinimized(true); // <-- Minimize drawer immediately for map view

        // Initialize Progress State
        let initialProgress = {
            currentStepIndex: 0,
            points: 0,
            completedSteps: {}
        };
        if (experience.type === 'Kunuz') {
            initialProgress.timeRemaining = experience.timeLimit; // TODO: Implement actual timer
            console.log("Kunuz timer should start now for", experience.timeLimit);
        }
        setActiveQuestProgress(initialProgress);
        setStepCompletionMessage(''); // Clear previous messages
        setShowRewardModal(false); // Ensure reward modal is hidden

    }, []);

    // --- View Map (Passive) ---
    const handleViewMapForExperience = useCallback((experience) => {
        console.log("Viewing map for experience:", experience.id);
        setSelectedExperience(experience);
        setCurrentView('mapInteraction');
        setIsDrawerMinimized(true); // Go to peek mode
        setActiveQuestProgress(null); // No active progress when just viewing
        setStepCompletionMessage('');
        setShowRewardModal(false);
    }, []);

    // --- Submit Kunuz Step ---
    const handleSubmitKunuzStep = useCallback((stepId, submissionData) => {
        console.log(`Submitting Step ${stepId}:`, submissionData);
        if (!selectedExperience || selectedExperience.type !== 'Kunuz' || !activeQuestProgress) {
            console.error("Submission failed: No selected Kunuz experience or progress.");
            return;
        }

        const currentStepIndex = activeQuestProgress.currentStepIndex;
        if (currentStepIndex >= selectedExperience.steps.length) {
            console.warn("Attempted to submit step after completion.");
            return; // Already finished
        }
        const step = selectedExperience.steps[currentStepIndex];

        // Ensure the submitted step ID matches the current step
        if (step.id !== stepId) {
            console.error(`Submission error: Expected step ${step.id}, but got ${stepId}`);
            return;
        }

        // --- Validation Logic ---
        let isCorrect = false;
        let errorMessage = "Incorrect submission. Please try again.";
        if (!step) {
            console.error("Submission error: Could not find current step data.");
            errorMessage = "Error processing step. Please try again.";
        } else if (step.type === 'qa') {
            isCorrect = (submissionData?.trim().toLowerCase() === step.answer?.trim().toLowerCase());
            console.log("QA:", submissionData, "Expected:", step.answer, "Correct:", isCorrect);
        } else if (step.type === 'qr') {
            isCorrect = (submissionData === step.qrValue);
            console.log("QR:", submissionData, "Expected:", step.qrValue, "Correct:", isCorrect);
            if (!isCorrect && submissionData) errorMessage = "Incorrect QR code scanned.";
            else if (!submissionData) errorMessage = "QR scan failed or was cancelled.";
        } else if (step.type === 'photo') {
            isCorrect = !!submissionData; // Auto-approve photo if data exists (simulation)
            console.log("Photo submitted:", submissionData, "Correct:", isCorrect);
            if (!isCorrect) errorMessage = "Photo capture failed or was cancelled.";
        } else {
            console.warn("Unhandled step type for validation:", step.type);
            isCorrect = true; // Default to correct for unknown types for now?
        }
        // --- End Validation ---

        if (isCorrect) {
            const pointsEarned = step.points ?? 0;
            // Show completion popup
            setStepCompletionMessage(`Step Complete! +${pointsEarned} Points`);

            setActiveQuestProgress(prev => {
                if (!prev) return null; // Should not happen, but safety check
                const nextStepIndex = prev.currentStepIndex + 1;
                const newPoints = (prev.points ?? 0) + pointsEarned;
                const newCompletedSteps = { ...prev.completedSteps, [stepId]: submissionData ?? true }; // Store data or true

                // Check if finished
                if (nextStepIndex >= selectedExperience.steps.length) {
                    console.log("KUNUZ FINISHED!");
                    // TODO: Stop timer logic
                    // Show Reward Modal instead of alert
                    setShowRewardModal(true);

                    // Update profile points (example)
                    setUserProfileData(currentProfile => ({
                        ...currentProfile,
                        points: (currentProfile.points ?? 0) + newPoints,
                        // Add to completed experiences if not already there
                        completedExperiences: [
                            ...(currentProfile.completedExperiences?.filter(e => e.id !== selectedExperience.id) || []),
                            { id: selectedExperience.id, title: selectedExperience.title, date: new Date().toISOString().split('T')[0], type: 'Kunuz'}
                        ]
                    }));

                    // Keep progress state to show completion, but mark as finished
                    return {
                        ...prev,
                        currentStepIndex: nextStepIndex, // Index goes beyond bounds
                        points: newPoints,
                        completedSteps: newCompletedSteps,
                        isFinished: true, // Add a flag
                        // timeRemaining: calculateFinalTime(), // TODO
                    };
                }

                // Go to next step
                return {
                    ...prev,
                    currentStepIndex: nextStepIndex,
                    points: newPoints,
                    completedSteps: newCompletedSteps,
                };
            });
        } else {
            // Handle incorrect submission (e.g., show error message via alert or popup)
            alert(errorMessage); // Using alert for simplicity, could use another popup state
            console.log("Incorrect submission for step", stepId);
        }

    }, [selectedExperience, activeQuestProgress]);

    const handleDismissStepPopup = useCallback(() => {
        setStepCompletionMessage('');
    }, []);

    const handleCloseRewardModal = useCallback(() => {
        setShowRewardModal(false);
        // Optionally navigate away after closing reward modal
        // handleBackToList(); // Example: Go back to list view
        if (selectedExperience) {
            handleExperienceSelect(selectedExperience); // Go back to detail view
        } else {
            handleBackToList();
        }
    }, [selectedExperience, handleExperienceSelect, handleBackToList]); // Add dependencies


    // --- Navigation ---
    const handleTabChange = useCallback((tabName, viewTarget) => {
        setActiveBottomTab(tabName);
        setShowRewardModal(false); // Close modals on nav change
        setStepCompletionMessage('');

        if (viewTarget === 'list') {
            setCurrentView('list');
            if (!selectedExperienceType) setSelectedExperienceType('Kunuz');
            setSelectedExperience(null);
            setActiveQuestProgress(null);
            setIsDrawerMinimized(false);
        } else if (viewTarget === 'profile') {
            setCurrentView('profile');
            setSelectedExperience(null);
            setActiveQuestProgress(null);
            setIsDrawerMinimized(false);
        } else if (viewTarget === 'services') {
            setCurrentView('services');
            setSelectedExperience(null);
            setActiveQuestProgress(null);
            setIsDrawerMinimized(false);
            alert("Services View Not Implemented Yet");
        } else { // Default to map/initial explore view
            setCurrentView('map');
            setSelectedExperience(null);
            setActiveQuestProgress(null);
            setIsDrawerMinimized(true);
        }
    }, [selectedExperienceType]);

    const handleCloseProfile = useCallback(() => {
        setCurrentView('list'); // Go back to list view after closing profile
        setActiveBottomTab('Experiences');
        if (!selectedExperienceType) setSelectedExperienceType('Kunuz'); // Ensure type is set for list
    }, [selectedExperienceType]);


    return (
        <div className="relative h-screen w-screen flex flex-col bg-gray-800 overflow-hidden">

            {/* Initial Selection Modal */}
            {showInitialModal && (
                <ExperienceSelectionModal
                    onSelect={handleInitialSelection}
                    onClose={handleCloseInitialModal}
                />
            )}

            {/* Main Content Area (Map) */}
            <div className="flex-grow relative">
                <MapView
                    onMapClick={handleMapClick}
                    isDrawerMinimized={isDrawerMinimized}
                    bottomNavHeight={BOTTOM_NAV_HEIGHT}
                    minimizedDrawerPeekHeight={MINIMIZED_DRAWER_PEEK_HEIGHT}
                    currentView={currentView}
                    selectedExperience={selectedExperience}
                    activeQuestProgress={activeQuestProgress}
                    // Pass key for re-rendering map center if needed, e.g. based on selectedExperience.id
                    key={selectedExperience?.id || 'map-default'}
                />
            </div>

            {/* Interactive Drawer */}
            <InteractiveDrawer
                isMinimized={isDrawerMinimized}
                onExpandRequest={handleExpandRequest}
                onMinimizeRequest={handleMinimizeRequest}
                onSearchFocusRequest={handleSearchFocus}
                bottomNavHeight={BOTTOM_NAV_HEIGHT}
                minimizedDrawerPeekHeight={MINIMIZED_DRAWER_PEEK_HEIGHT}
                currentView={currentView}
                selectedExperienceType={selectedExperienceType}
                selectedExperience={selectedExperience}
                experiencesData={experiencesData}
                userProfileData={userProfileData}
                activeQuestProgress={activeQuestProgress}
                favoriteExperienceIds={favoriteExperienceIds}
                onExperienceSelect={handleExperienceSelect}
                onBackToList={handleBackToList}
                onStartExperience={handleStartExperience}
                onViewMapForExperience={handleViewMapForExperience}
                onSubmitKunuzStep={handleSubmitKunuzStep}
                onToggleFavorite={toggleFavorite}
                onViewProfile={() => handleTabChange('Profile', 'profile')}
                onCloseProfile={handleCloseProfile}
            />

            {/* Bottom Navigation */}
            <BottomNavigationBar
                activeTab={activeBottomTab}
                onTabChange={handleTabChange}
            />

            {/* Step Completion Popup */}
            <StepCompletionPopup
                message={stepCompletionMessage}
                isVisible={!!stepCompletionMessage}
                onDismiss={handleDismissStepPopup}
            />

            {/* Reward Modal */}
            {showRewardModal && selectedExperience?.prize && (
                <RewardModal
                    prize={selectedExperience.prize}
                    onClose={handleCloseRewardModal}
                />
            )}
        </div>
    );
}

export default App;