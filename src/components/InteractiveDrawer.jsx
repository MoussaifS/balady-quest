import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

// Import Views/Components
import SearchAndFilters from './SearchAndFilters';
import ExperienceListView from '../views/ExperienceListView'; // View
import KunuzDetailView from '../views/KunuzDetailView';     // View
import MasaratDetailView from '../views/MasaratDetailView'; // View
import UserProfileView from '../views/UserProfileView';     // View
import ExperienceDetailMapInteraction from '../views/ExperienceDetailMapInteraction'; // View for Map Mode

// Import Icons
import { FiArrowLeft, FiMap, FiUser } from 'react-icons/fi';

// Helper function to get viewport height
const getViewportHeight = () => {
    if (typeof window !== 'undefined') {
        return window.innerHeight;
    }
    return 800; // Default height
};

function InteractiveDrawer({
                               isMinimized,
                               onExpandRequest,
                               onMinimizeRequest, // New: Add ability to request minimize
                               onSearchFocusRequest,
                               bottomNavHeight,
                               minimizedDrawerPeekHeight,
                               // NEW State Props from App.js
                               currentView, // 'initial', 'list', 'detail', 'profile', 'mapInteraction'
                               selectedExperienceType, // 'Kunuz' or 'Masarat' (when view is 'list')
                               selectedExperience, // The full experience object (when view is 'detail' or 'mapInteraction')
                               experiencesData, // Array of all experiences
                               userProfileData, // User profile info
                               activeQuestProgress, // State for active Kunuz hunt { currentStepIndex, points, timeRemaining, completedSteps: {stepId: data} }
                               favoriteExperienceIds, // Set or Array of favorite IDs
                               // NEW Handlers from App.js
                               onExperienceSelect, // Func(experience) -> sets selectedExperience, sets view to 'detail'
                               onBackToList, // Func() -> clears selectedExperience, sets view to 'list'
                               onStartExperience, // Func(experience) -> sets view to 'mapInteraction', potentially starts timer/progress
                               onViewMapForExperience, // Func(experience) -> sets view to 'mapInteraction' (maybe passive view)
                               onSubmitKunuzStep, // Func(stepId, submissionData) -> updates activeQuestProgress
                               onToggleFavorite, // Func(experienceId)
                               onViewProfile, // Func() -> sets view to 'profile'
                               onCloseProfile, // Func() -> sets view back to 'list' or 'map'
                           }) {
    const contentRef = useRef(null);
    const headerRef = useRef(null);

    // --- Drawer Animation ---
    const vh = getViewportHeight();
    const expandedTop = vh * 0.10;
    const mapInteractionPeekTop = vh - bottomNavHeight - 150; // Peek height when map is active
    const minimizedTop = vh - bottomNavHeight - minimizedDrawerPeekHeight;

    const getTargetTop = () => {
        if (currentView === 'mapInteraction') return mapInteractionPeekTop;
        return isMinimized ? minimizedTop : expandedTop;
    };

    const [{ top }, api] = useSpring(() => ({
        top: getTargetTop(),
        config: { tension: 280, friction: 30 },
    }));

    useEffect(() => {
        api.start({ top: getTargetTop() });
        // Reset scroll on view change, except when going to map interaction
        if (contentRef.current && currentView !== 'mapInteraction') {
            contentRef.current.scrollTop = 0;
        }
    }, [isMinimized, currentView, api, bottomNavHeight, minimizedDrawerPeekHeight, mapInteractionPeekTop]);

    // --- Dynamic Header Content ---
    const renderHeaderTitle = () => {
        if (currentView === 'detail' && selectedExperience) return selectedExperience.title;
        if (currentView === 'profile') return "My Profile";
        if (currentView === 'mapInteraction' && selectedExperience) return `Active: ${selectedExperience.title}`;
        // List view title could be added if needed ("Kunuz Hunts" / "Masarat Trails")
        return ""; // Default for list or initial
    };

    const showBackButton = (currentView === 'detail' || currentView === 'profile' || currentView === 'mapInteraction');
    const handleBackClick = () => {
        if (currentView === 'detail') onBackToList();
        else if (currentView === 'profile') onCloseProfile();
        else if (currentView === 'mapInteraction') {
            // Decide: Go back to detail view or list view? Let's go to detail for now.
            if (selectedExperience) {
                onExperienceSelect(selectedExperience); // This sets view to 'detail'
            } else {
                onBackToList(); // Fallback
            }
        }
    };

    // Determine if the main search/filter header should be shown
    // Hide it in detail, profile, and map interaction modes.
    const showSearchAndFiltersHeader = currentView === 'list' || currentView === 'initial' || isMinimized;


    // --- Render Correct View Content ---
    const renderContentView = () => {
        switch (currentView) {
            case 'list':
                return (
                    <ExperienceListView
                        experiences={experiencesData.filter(exp => exp.type === selectedExperienceType)}
                        onExperienceSelect={onExperienceSelect}
                        onToggleFavorite={onToggleFavorite}
                        favoriteExperienceIds={favoriteExperienceIds}
                        listType={selectedExperienceType} // Pass type for potential specific styling
                    />
                );
            case 'detail':
                if (!selectedExperience) return <div className="p-4 text-center text-gray-500">Error: No experience selected.</div>;
                if (selectedExperience.type === 'Kunuz') {
                    return <KunuzDetailView
                        experience={selectedExperience}
                        onStart={onStartExperience}
                        onViewMap={onViewMapForExperience} // Optional: Button to just view map pins
                    />;
                } else {
                    return <MasaratDetailView
                        experience={selectedExperience}
                        onStart={onStartExperience}
                        onViewMap={onViewMapForExperience}
                    />;
                }
            case 'profile':
                return <UserProfileView
                    user={userProfileData}
                    experiences={experiencesData} // Needed to show titles from IDs
                    onSelectExperience={onExperienceSelect} // Allow clicking completed/ongoing
                />;
            case 'mapInteraction':
                if (!selectedExperience) return <div className="p-4 text-center text-gray-500">Error: No active experience.</div>;
                return <ExperienceDetailMapInteraction
                    experience={selectedExperience}
                    progress={activeQuestProgress}
                    onSubmitStep={onSubmitKunuzStep}
                    onExpandRequest={onExpandRequest} // Allow expanding drawer from map interaction view
                />
            case 'initial': // Or when minimized showing categories
            default:
                // Potentially show something else when minimized and not searching
                // Or just keep it blank below the search/filters
                return <div className="h-full bg-gray-50"></div>; // Placeholder empty state
        }
    };

    return (
        <animated.div
            className="fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-30 overflow-hidden flex flex-col"
            style={{ top }}
        >
            {/* --- Static Header Area --- */}
            <div ref={headerRef} className="flex-shrink-0 border-b border-gray-200 bg-white rounded-t-2xl">
                {/* Handle (Clickable to expand/minimize based on context) */}
                <div
                    className="w-full h-5 flex justify-center items-center cursor-pointer pt-2"
                    onClick={isMinimized ? onExpandRequest : (currentView !== 'mapInteraction' ? onMinimizeRequest : undefined)} // Minimize only if not in map mode? Or allow toggling peek/full?
                    title={isMinimized ? "Expand" : (currentView !== 'mapInteraction' ? "Minimize" : "")}
                >
                    <div className={`w-10 h-1 rounded-full ${isMinimized ? 'bg-cyan-500' : 'bg-gray-300'}`}></div>
                </div>

                {/* Back Button & Title Area (Shown when NOT minimized and NOT showing search filters) */}
                <div className={`px-4 pt-1 flex items-center min-h-[36px] ${isMinimized || showSearchAndFiltersHeader ? 'hidden' : ''}`}>
                    {showBackButton ? (
                        <button onClick={handleBackClick} aria-label="Back" className="text-gray-600 hover:text-cyan-600 p-1 -ml-1 mr-2 transition-colors">
                            <FiArrowLeft size={22} />
                        </button>
                    ) : (
                        <div className="w-8 flex-shrink-0"></div> // Spacer
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 text-center truncate flex-grow px-1">
                        {renderHeaderTitle()}
                    </h2>
                    {/* Right side placeholder/action (e.g., Map icon for detail view?) */}
                    <div className="w-8 flex-shrink-0">
                        {(currentView === 'detail' && selectedExperience) && (
                            <button onClick={() => onViewMapForExperience(selectedExperience)} className="text-gray-600 hover:text-cyan-600 p-1" title="View on Map">
                                <FiMap size={20}/>
                            </button>
                        )}
                        {(currentView === 'profile') && (
                            <button onClick={() => console.log("Edit profile...")} className="text-gray-600 hover:text-cyan-600 p-1" title="Settings">
                                {/* <FiSettings size={20}/> Placeholder */}
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Bar and Category Filters (Shown when Minimized OR in List view) */}
                {showSearchAndFiltersHeader && (
                    <SearchAndFilters
                        isMinimized={isMinimized && currentView !== 'list'} // Adjust logic based on desired behavior
                        onSearchFocus={onSearchFocusRequest}
                    />
                )}
            </div>

            {/* --- Scrollable/Main Content Area --- */}
            <div
                ref={contentRef}
                // Hide content completely when minimized AND not showing map interaction peek
                className={`flex-grow overflow-y-auto drawer-content-scrollable ${ (isMinimized && currentView !== 'mapInteraction') ? 'hidden' : 'block'}`}
                style={{ WebkitOverflowScrolling: 'touch' }} // For smoother scrolling on iOS
            >
                {renderContentView()}
            </div>

        </animated.div>
    );
}

export default InteractiveDrawer;