// src/components/InteractiveDrawer.js
import React, { useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

// Import Views/Components
import SearchAndFilters from './SearchAndFilters';
import ExperienceListView from '../views/ExperienceListView';
import KunuzDetailView from '../views/KunuzDetailView';
import MasaratDetailView from '../views/MasaratDetailView';
import UserProfileView from '../views/UserProfileView';
import ExperienceDetailMapInteraction from '../views/ExperienceDetailMapInteraction';

// Import Icons
import {FiArrowLeft, FiMap, FiUser, FiChevronUp, FiChevronDown, FiPlay} from 'react-icons/fi'; // Added Chevrons

// Helper function to get viewport height (Keep as is)
const getViewportHeight = () => {
    if (typeof window !== 'undefined') { return window.innerHeight; }
    return 800;
};

const BOTTOM_NAV_HEIGHT_APPROX = 56; // Corresponds to h-14
const ACTION_BUTTON_AREA_HEIGHT_APPROX = 80;

function InteractiveDrawer({
                               isMinimized,
                               onExpandRequest,
                               onMinimizeRequest,
                               onSearchFocusRequest,
                               bottomNavHeight,
                               minimizedDrawerPeekHeight,
                               // State Props from App.js
                               currentView,
                               selectedExperienceType,
                               selectedExperience,
                               experiencesData,
                               userProfileData,
                               activeQuestProgress,
                               favoriteExperienceIds,
                               // Handlers from App.js
                               onExperienceSelect,
                               onBackToList,
                               onStartExperience,
                               onViewMapForExperience,
                               onSubmitKunuzStep,
                               onToggleFavorite,
                               onViewProfile,
                               onCloseProfile,
                           }) {
    const contentRef = useRef(null);
    const headerRef = useRef(null);

    // --- Drawer Animation ---
    const vh = getViewportHeight();
    const expandedTop = vh * 0.10; // ~10% from top when expanded
    // Slightly taller peek for map interaction to show progress better
    const mapInteractionPeekTop = vh - bottomNavHeight - 250;
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
        if (contentRef.current && currentView !== 'mapInteraction') {
            contentRef.current.scrollTop = 0;
        }
    }, [isMinimized, currentView, api, bottomNavHeight, minimizedDrawerPeekHeight, mapInteractionPeekTop, expandedTop, minimizedTop]); // Added dependencies

    // --- Dynamic Header Content ---
    const renderHeaderTitle = () => {
        if (currentView === 'detail' && selectedExperience) return selectedExperience.title;
        if (currentView === 'profile') return "My Profile";
        // Show step progress in header during map interaction
        if (currentView === 'mapInteraction' && selectedExperience && activeQuestProgress) {
            const totalSteps = selectedExperience.type === 'Kunuz' ? selectedExperience.steps?.length ?? 0 : selectedExperience.path?.length ?? 0;
            const currentStepNum = activeQuestProgress.isFinished ? totalSteps : (activeQuestProgress.currentStepIndex ?? 0) + 1;
            return `${selectedExperience.title} (${currentStepNum}/${totalSteps})`;
        }
        // Add title for List View
        if (currentView === 'list') {
            return selectedExperienceType === 'Kunuz' ? 'Kunuz Scavenger Hunts' : 'Masarat Experiences';
        }
        return ""; // Default (initial/minimized)
    };

    const showBackButton = (currentView === 'detail' || currentView === 'profile');
    const handleBackClick = () => {
        if (currentView === 'detail') onBackToList();
        else if (currentView === 'profile') onCloseProfile();
        // Back button is not shown in mapInteraction view in this setup
    };

    // --- Hide Search/Filters in Detail, Profile, and Map Interaction views ---
    const showSearchAndFiltersHeader = currentView === 'list' || currentView === 'initial';

    // --- Render Correct View Content ---
    const renderContentView = () => {
        switch (currentView) {
            case 'list':
                // Filter out experiences of the non-selected type BEFORE passing down
                const experiencesToList = experiencesData.filter(exp => exp.type === selectedExperienceType);
                return (
                    <ExperienceListView
                        experiences={experiencesToList}
                        onExperienceSelect={onExperienceSelect}
                        onToggleFavorite={onToggleFavorite}
                        favoriteExperienceIds={favoriteExperienceIds}
                        listType={selectedExperienceType}
                    />
                );
            case 'detail':
                if (!selectedExperience) return <div className="p-4 text-center text-gray-500">Error: No experience selected.</div>;
                if (selectedExperience.type === 'Kunuz') {
                    return <KunuzDetailView
                        experience={selectedExperience}
                        onStart={onStartExperience}
                        onViewMap={onViewMapForExperience}
                        onToggleFavorite={onToggleFavorite} // Pass toggle favorite
                        isFavorite={favoriteExperienceIds?.has(selectedExperience.id)} // Pass favorite status
                    />;
                } else {
                    return <MasaratDetailView
                        experience={selectedExperience}
                        onStart={onStartExperience}
                        onViewMap={onViewMapForExperience}
                        onToggleFavorite={onToggleFavorite} // Pass toggle favorite
                        isFavorite={favoriteExperienceIds?.has(selectedExperience.id)} // Pass favorite status
                    />;
                }
            case 'profile':
                return <UserProfileView
                    user={userProfileData}
                    experiences={experiencesData}
                    onSelectExperience={onExperienceSelect}
                />;
            case 'mapInteraction':
                if (!selectedExperience) return <div className="p-4 text-center text-gray-500">Error: No active experience.</div>;
                // Show loading if progress is null but experience is selected (might happen briefly)
                if (!activeQuestProgress && selectedExperience.type === 'Kunuz') {
                    return <div className="p-4 text-center text-gray-500">Loading quest progress...</div>;
                }
                // Handle Masarat passive map view
                if (selectedExperience.type === 'Masarat' && !activeQuestProgress) {
                    // Show basic info or path list for Masarat when just viewing map
                    return (
                        <div className="p-4 pt-1">
                            <h5 className="font-semibold text-gray-800 mb-1">Viewing Path: {selectedExperience.title}</h5>
                            <p className="text-sm text-gray-600">See the route and stops on the map.</p>
                            {/* Button to expand drawer for full detail */}
                            <button onClick={onExpandRequest} className="mt-4 w-full text-cyan-600 font-medium text-sm py-2 rounded hover:bg-gray-100 flex items-center justify-center">
                                <FiChevronUp className="mr-1" /> Show Full Details
                            </button>
                        </div>
                    )
                }

                return <ExperienceDetailMapInteraction
                    experience={selectedExperience}
                    progress={activeQuestProgress}
                    onSubmitStep={onSubmitKunuzStep}
                    onExpandRequest={onExpandRequest} // Allow expanding drawer
                    onViewDetailsRequest={() => onExperienceSelect(selectedExperience)} // Add handler to go back to detail
                />
            case 'initial':
                // Show category chips or something else when minimized initial state?
                // Let's keep SearchAndFilters visible via showSearchAndFiltersHeader logic
                return <div className="h-32 bg-gray-50"></div>; // Placeholder empty space below search
            default:
                return <div className="h-full bg-gray-50"></div>;
        }
    };

    const bottomPadding = currentView === 'detail'
        ? BOTTOM_NAV_HEIGHT_APPROX + ACTION_BUTTON_AREA_HEIGHT_APPROX
        : BOTTOM_NAV_HEIGHT_APPROX;

    return (
        <animated.div
            className="fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-30 overflow-hidden flex flex-col"
            style={{ top }}
        >
            {/* --- Static Header Area (Keep as is) --- */}
            <div ref={headerRef} className="flex-shrink-0 border-b border-gray-200 bg-white rounded-t-2xl z-10">
            {/* Handle (Clickable to expand/minimize) */}
                <div
                    className="w-full h-5 flex justify-center items-center cursor-pointer pt-2"
                    onClick={isMinimized ? onExpandRequest : onMinimizeRequest}
                    title={isMinimized ? "Expand" : "Minimize"}
                >
                    <div className={`w-10 h-1 rounded-full ${isMinimized ? 'bg-cyan-500' : 'bg-gray-300'}`}></div>
                </div>

                {/* Back Button & Title Area */}
                <div className={`px-4 pt-1 flex items-center min-h-[36px] ${isMinimized ? 'hidden' : ''}`}>
                    {showBackButton ? (
                        <button onClick={handleBackClick} aria-label="Back" className="text-gray-600 hover:text-cyan-600 p-1 -ml-1 mr-2 transition-colors">
                            <FiArrowLeft size={22} />
                        </button>
                    ) : (
                        // Show expand/collapse icon when not showing back button
                        <button onClick={isMinimized ? onExpandRequest : onMinimizeRequest} aria-label={isMinimized ? "Expand" : "Minimize"} className="text-gray-500 hover:text-cyan-600 p-1 -ml-1 mr-2 transition-colors">
                            {isMinimized ? <FiChevronUp size={22} /> : <FiChevronDown size={22} />}
                        </button>
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 text-center truncate flex-grow px-1">
                        {renderHeaderTitle()}
                    </h2>
                    {/* Right side placeholder/action (e.g., Map icon for detail view?) */}
                    <div className="w-8 flex-shrink-0">
                        {/* Show Map icon only when in detail view */}
                        {(currentView === 'detail' && selectedExperience) && (
                            <button onClick={() => onViewMapForExperience(selectedExperience)} className="text-gray-600 hover:text-cyan-600 p-1" title="View on Map">
                                <FiMap size={20}/>
                            </button>
                        )}
                        {/* Removed profile button here, handled by bottom nav */}
                    </div>
                </div>

                {/* Search Bar and Category Filters (Shown ONLY in List or Initial states) */}
                {showSearchAndFiltersHeader && (
                    <SearchAndFilters
                        // Pass isMinimized state to allow SearchAndFilters to adapt its layout if needed
                        isMinimized={isMinimized && currentView === 'initial'} // Example: only truly minimized in initial state
                        onSearchFocus={onSearchFocusRequest}
                    />
                )}
            </div>

            {/* --- Scrollable/Main Content Area --- */}
            <div
                ref={contentRef}
                className={`flex-grow overflow-y-auto drawer-content-scrollable ${ (isMinimized && currentView !== 'mapInteraction') ? 'hidden' : 'block'}`}
                // Apply dynamic bottom padding using inline style
                style={{
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: `${bottomPadding}px` // Apply calculated padding
                }}
            >
                {renderContentView()}
            </div>

            {currentView === 'detail' && selectedExperience && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10 flex items-center space-x-3"> {/* Added z-10 */}
                    {selectedExperience.type === 'Kunuz' ? (
                        // Kunuz Buttons
                        <>
                            <button
                                onClick={() => onStartExperience(selectedExperience)}
                                className="flex-grow flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150"
                            >
                                <FiPlay size={20} />
                                <span>Start Hunt</span>
                            </button>
                            <button
                                onClick={() => onViewMapForExperience(selectedExperience)}
                                className="flex-shrink-0 p-3 border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors duration-150"
                                title="View Stops on Map"
                            >
                                <FiMap size={20} />
                            </button>
                        </>
                    ) : (
                        // Masarat Buttons
                        <>
                            <button
                                onClick={() => onStartExperience(selectedExperience)}
                                className="flex-grow flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-150"
                            >
                                <FiPlay size={20} />
                                <span>Start Experience</span>
                            </button>
                            <button
                                onClick={() => onViewMapForExperience(selectedExperience)}
                                className="flex-shrink-0 p-3 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-150"
                                title="View Path on Map"
                            >
                                <FiMap size={20} />
                            </button>
                        </>
                    )}
                </div>
            )}

        </animated.div>
    );
}

export default InteractiveDrawer;