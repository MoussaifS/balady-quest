import React, { useState, useCallback, useEffect } from 'react';
import MapView from './components/MapView';
import InteractiveDrawer from './components/InteractiveDrawer';
import BottomNavigationBar from './components/BottomNavigationBar';
import ExperienceSelectionModal from './components/ExperienceSelectionModal';

// Import Mock Data
import { mockExperiences, mockUserProfile } from './data/mockData';

const BOTTOM_NAV_HEIGHT = 56;
const MINIMIZED_DRAWER_PEEK_HEIGHT = 90;

// Helper to manage favorite IDs (using Set for efficiency)
const useFavorites = (initialFavorites = []) => {
    const [favoriteIds, setFavoriteIds] = useState(new Set(initialFavorites));

    const toggleFavorite = useCallback((experienceId) => {
        setFavoriteIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(experienceId)) {
                newSet.delete(experienceId);
                console.log("Removed favorite:", experienceId);
            } else {
                newSet.add(experienceId);
                console.log("Added favorite:", experienceId);
            }
            // Persist to localStorage maybe?
            // localStorage.setItem('favoriteExperienceIds', JSON.stringify(Array.from(newSet)));
            return newSet;
        });
    }, []);

    // Load from localStorage on mount (optional)
    useEffect(() => {
        // const storedFavorites = localStorage.getItem('favoriteExperienceIds');
        // if (storedFavorites) {
        //     try {
        //         setFavoriteIds(new Set(JSON.parse(storedFavorites)));
        //     } catch (e) { console.error("Failed to load favorites", e); }
        // }
        // For demo, use initial favorites from mock data
        setFavoriteIds(new Set(mockUserProfile.savedExperiences || []));
    }, []);


    return [favoriteIds, toggleFavorite];
};

// --- Main App Component ---
function App() {
    // --- Core State ---
    const [isDrawerMinimized, setIsDrawerMinimized] = useState(true); // Drawer physical state
    const [currentView, setCurrentView] = useState('initial'); // 'initial', 'list', 'detail', 'profile', 'mapInteraction', 'services'
    const [showInitialModal, setShowInitialModal] = useState(true); // Control the first popup
    const [selectedExperienceType, setSelectedExperienceType] = useState(null); // 'Kunuz' or 'Masarat'
    const [selectedExperience, setSelectedExperience] = useState(null); // The actual experience object
    const [activeBottomTab, setActiveBottomTab] = useState('Explore'); // For bottom nav highlight

    // --- Mock Data State ---
    const [experiencesData, setExperiencesData] = useState(mockExperiences);
    const [userProfileData, setUserProfileData] = useState(mockUserProfile);
    const [favoriteExperienceIds, toggleFavorite] = useFavorites(userProfileData.savedExperiences);

    // --- Active Quest State (Example - needs more robust logic for timers etc.) ---
    const [activeQuestProgress, setActiveQuestProgress] = useState(null);
    // { currentStepIndex: 0, points: 0, timeRemaining: '2h 0m', completedSteps: {} }

    // --- Handlers ---
    const handleMapClick = useCallback(() => {
        // Minimize drawer only if it's expanded AND not in map interaction mode
        if (!isDrawerMinimized && currentView !== 'mapInteraction') {
            console.log("Map clicked, minimizing drawer.");
            setIsDrawerMinimized(true);
        } else if (currentView === 'mapInteraction') {
            console.log("Map clicked during interaction - drawer stays peek");
        }
    }, [isDrawerMinimized, currentView]);

    const handleExpandRequest = useCallback(() => {
        if (isDrawerMinimized) {
            console.log("Expand requested.");
            setIsDrawerMinimized(false);
        }
    }, [isDrawerMinimized]);

    const handleMinimizeRequest = useCallback(() => {
        if (!isDrawerMinimized) {
            console.log("Minimize requested.");
            setIsDrawerMinimized(true);
        }
    }, [isDrawerMinimized]);

    const handleSearchFocus = useCallback(() => {
        if (isDrawerMinimized) {
            console.log("Search focused, expanding drawer.");
            setIsDrawerMinimized(false);
            // Optionally switch view if needed, e.g., to list or a dedicated search results view
            // if (currentView === 'initial') setCurrentView('list');
        }
    }, [isDrawerMinimized]);

    const handleInitialSelection = (type) => {
        console.log("Selected type:", type);
        setSelectedExperienceType(type);
        setCurrentView('list'); // Go to list view
        setShowInitialModal(false);
        setIsDrawerMinimized(false); // Expand drawer to show list
        setActiveBottomTab('Experiences'); // Highlight Experiences tab
    };

    const handleCloseInitialModal = () => {
        setShowInitialModal(false);
        // Decide what to do if closed without selection - maybe default to list?
        // setCurrentView('list');
        // setSelectedExperienceType('Kunuz'); // Default?
        // Or just stay in 'initial' map view state? Let's stay initial.
        setCurrentView('map'); // Go back to map focus
        setIsDrawerMinimized(true); // Minimize drawer
        setActiveBottomTab('Explore');
    };

    const handleExperienceSelect = useCallback((experience) => {
        console.log("Selected experience:", experience.id);
        setSelectedExperience(experience);
        setCurrentView('detail');
        setIsDrawerMinimized(false); // Ensure drawer is expanded
    }, []);

    const handleBackToList = useCallback(() => {
        console.log("Back to list view.");
        setSelectedExperience(null);
        setCurrentView('list');
        // Keep drawer expanded
    }, []);

    const handleStartExperience = useCallback((experience) => {
        console.log("Starting experience:", experience.id);
        setSelectedExperience(experience); // Make sure it's set
        setCurrentView('mapInteraction');
        setIsDrawerMinimized(true); // Set drawer to peek mode for map interaction

        // --- Initialize Progress State (Example for Kunuz) ---
        if (experience.type === 'Kunuz') {
            setActiveQuestProgress({
                currentStepIndex: 0,
                points: 0,
                timeRemaining: experience.timeLimit, // Need a timer mechanism here
                completedSteps: {} // { stepId: submissionData }
            });
            // TODO: Start Timer logic here
            console.log("Kunuz timer should start now for", experience.timeLimit);
        } else {
            // Initialize progress for Masarat (maybe just step index)
            setActiveQuestProgress({
                currentStepIndex: 0,
                completedSteps: {}
            });
        }
    }, []);

    const handleViewMapForExperience = useCallback((experience) => {
        console.log("Viewing map for experience:", experience.id);
        setSelectedExperience(experience);
        setCurrentView('mapInteraction'); // Use the same view, but progress might be null/different
        setIsDrawerMinimized(true); // Go to peek mode
        // Don't initialize progress if just viewing
        // setActiveQuestProgress(null); // Or load saved progress if exists
    }, []);

    const handleSubmitKunuzStep = useCallback((stepId, submissionData) => {
        console.log(`Submitting Step ${stepId}:`, submissionData);
        if (!selectedExperience || selectedExperience.type !== 'Kunuz' || !activeQuestProgress) return;

        const currentStepIndex = activeQuestProgress.currentStepIndex;
        const step = selectedExperience.steps[currentStepIndex];

        // --- Validation Logic (Placeholder) ---
        let isCorrect = false;
        if (step.type === 'qa') {
            isCorrect = (submissionData?.toLowerCase() === step.answer?.toLowerCase());
            console.log("QA:", submissionData, "Expected:", step.answer, "Correct:", isCorrect);
        } else if (step.type === 'qr') {
            isCorrect = (submissionData === step.qrValue);
            console.log("QR:", submissionData, "Expected:", step.qrValue, "Correct:", isCorrect);
        } else if (step.type === 'photo') {
            isCorrect = true; // Auto-approve photo for now
            console.log("Photo submitted:", submissionData, "Correct:", isCorrect);
        } else if (step.type === 'location') {
            isCorrect = true; // Assume location reached is correct
            console.log("Location confirmed:", submissionData, "Correct:", isCorrect);
        }
        // --- End Validation ---

        if (isCorrect) {
            // Update Progress
            setActiveQuestProgress(prev => {
                const nextStepIndex = prev.currentStepIndex + 1;
                const newPoints = (prev.points ?? 0) + (step.points ?? 0);
                const newCompletedSteps = { ...prev.completedSteps, [stepId]: submissionData };

                // Check if finished
                if (nextStepIndex >= selectedExperience.steps.length) {
                    console.log("KUNUZ FINISHED!");
                    // TODO: Show completion summary, stop timer, award prize/badge
                    alert(`Congratulations! You finished ${selectedExperience.title} and earned ${newPoints} points!`);
                    // Maybe navigate back to detail view?
                    // setCurrentView('detail');
                    // Reset active progress?
                    // return null;
                    // For now, just keep state to show completion
                    return {
                        ...prev,
                        currentStepIndex: nextStepIndex, // Go beyond last index to indicate finish?
                        points: newPoints,
                        completedSteps: newCompletedSteps,
                        // timeRemaining: calculateFinalTime(), // Stop timer
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
            // Handle incorrect submission (e.g., show error message)
            alert("Incorrect submission. Please try again.");
            console.log("Incorrect submission for step", stepId);
        }

    }, [selectedExperience, activeQuestProgress]);


    const handleTabChange = useCallback((tabName, viewTarget) => {
        console.log("Tab changed to:", tabName, "Target view:", viewTarget);
        setActiveBottomTab(tabName);

        if (viewTarget === 'list') {
            setCurrentView('list');
            // Default to Kunuz or remember last? Let's default to Kunuz if nothing selected
            if (!selectedExperienceType) setSelectedExperienceType('Kunuz');
            setSelectedExperience(null); // Clear detail view
            setIsDrawerMinimized(false); // Expand drawer
        } else if (viewTarget === 'profile') {
            setCurrentView('profile');
            setSelectedExperience(null);
            setIsDrawerMinimized(false);
        } else if (viewTarget === 'services') {
            setCurrentView('services'); // Need a services view component
            setSelectedExperience(null);
            setIsDrawerMinimized(false);
            alert("Services View Not Implemented Yet"); // Placeholder
        } else { // Default to map/initial explore view
            setCurrentView('map'); // Or 'initial'? Let's use 'map' as the base state
            setSelectedExperience(null);
            setIsDrawerMinimized(true); // Minimize drawer for map focus
        }
    }, [selectedExperienceType]); // Include dependency if logic depends on it

    const handleCloseProfile = useCallback(() => {
        // Go back to the previous view? Or always list? Let's go back to list.
        setCurrentView('list');
        setActiveBottomTab('Experiences'); // Re-highlight list tab
    }, []);


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
                    isDrawerMinimized={isDrawerMinimized} // Pass for overlay positioning
                    bottomNavHeight={BOTTOM_NAV_HEIGHT}
                    minimizedDrawerPeekHeight={MINIMIZED_DRAWER_PEEK_HEIGHT}
                    // Pass data for experience layer
                    currentView={currentView}
                    selectedExperience={selectedExperience}
                    activeQuestProgress={activeQuestProgress}
                />
            </div>

            {/* Interactive Drawer */}
            <InteractiveDrawer
                // Drawer State & Control
                isMinimized={isDrawerMinimized}
                onExpandRequest={handleExpandRequest}
                onMinimizeRequest={handleMinimizeRequest}
                onSearchFocusRequest={handleSearchFocus}
                bottomNavHeight={BOTTOM_NAV_HEIGHT}
                minimizedDrawerPeekHeight={MINIMIZED_DRAWER_PEEK_HEIGHT}
                // View & Data State
                currentView={currentView}
                selectedExperienceType={selectedExperienceType}
                selectedExperience={selectedExperience}
                experiencesData={experiencesData}
                userProfileData={userProfileData}
                activeQuestProgress={activeQuestProgress}
                favoriteExperienceIds={favoriteExperienceIds}
                // Action Handlers
                onExperienceSelect={handleExperienceSelect}
                onBackToList={handleBackToList}
                onStartExperience={handleStartExperience}
                onViewMapForExperience={handleViewMapForExperience}
                onSubmitKunuzStep={handleSubmitKunuzStep}
                onToggleFavorite={toggleFavorite}
                onViewProfile={() => handleTabChange('Profile', 'profile')} // Reuse tab change logic
                onCloseProfile={handleCloseProfile}
            />

            {/* Bottom Navigation */}
            <BottomNavigationBar
                activeTab={activeBottomTab}
                onTabChange={handleTabChange}
            />
        </div>
    );
}

export default App;