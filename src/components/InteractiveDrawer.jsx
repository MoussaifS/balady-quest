import React, { useRef, useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

// Import Child Components
import FilterChip from './FilterChip'; // Used for list filters (Official/User etc.)
import QuestCard from './QuestCard';
import QuestDetailView from './QuestDetailView'; // Make sure this exists and is styled
import SearchAndFilters from './SearchAndFilters'; // Component for search and category chips

// Import Icons
import {
    FiGlobe, FiCheckCircle, FiUserCheck, FiStar, FiTrendingUp,
    FiArrowLeft, FiAward, FiPocket, FiHeart
} from 'react-icons/fi';

// Helper function to get viewport height
const getViewportHeight = () => {
    if (typeof window !== 'undefined') {
        return window.innerHeight;
    }
    return 800; // Default height
};

// --- Main Drawer Component ---
function InteractiveDrawer({
                               isMinimized,
                               onExpandRequest,
                               onSearchFocusRequest, // New prop for handling search focus
                               bottomNavHeight,
                               minimizedDrawerPeekHeight
                           }) {
    // --- State Definitions ---
    const [activeListFilter, setActiveListFilter] = useState('All'); // For "All/Official/User" in list view
    const [selectedQuest, setSelectedQuest] = useState(null); // For detail view

    // --- Refs ---
    const contentRef = useRef(null);
    const headerRef = useRef(null); // Ref for the static header area

    // --- Drawer Animation & Position Calculation ---
    const vh = getViewportHeight();
    const expandedTop = vh * 0.10; // Expanded: 10% from top
    const minimizedTop = vh - bottomNavHeight - minimizedDrawerPeekHeight; // Minimized position

    const [{ top }, api] = useSpring(() => ({
        top: isMinimized ? minimizedTop : expandedTop,
        config: { tension: 280, friction: 30 }
    }));

    // Update spring animation when isMinimized state changes
    useEffect(() => {
        const newVh = getViewportHeight();
        const newExpandedTop = newVh * 0.10;
        const newMinimizedTop = newVh - bottomNavHeight - minimizedDrawerPeekHeight;
        api.start({ top: isMinimized ? newMinimizedTop : newExpandedTop });
    }, [isMinimized, api, bottomNavHeight, minimizedDrawerPeekHeight]);

    // --- Handlers ---
    const handleQuestSelect = (quest) => {
        setSelectedQuest(quest);
        // Ensure drawer is expanded when selecting a quest
        if (isMinimized) {
            onExpandRequest(); // Trigger expansion
        }
        // Reset scroll position when showing details
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    };

    const handleBackToList = () => {
        setSelectedQuest(null);
        // Reset scroll position when going back to list
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
        // No need to explicitly expand here, as we only show back button when expanded
    };

    // --- Mock Data (Keep your existing data) ---
    const filters = [
        { id: 'All', label: 'All', icon: FiGlobe },
        { id: 'Culture', label: 'Culture & Heritage', icon: FiAward },
        { id: 'Parks', label: 'Parks & Rec', icon: FiPocket },
        { id: 'Foodie', label: 'Foodie Trails', icon: FiHeart },
        { id: 'Civic', label: 'Civic Awareness', icon: FiCheckCircle },
    ];
    const baseQuests = [
        {
            id: 1, imageUrl: 'https://via.placeholder.com/150/771796', title: 'Historic Jeddah Exploration', rating: 4.8, places: 8, joined: 1250,
            description: "Discover the secrets of Al-Balad, Jeddah's historic heart. Follow clues through ancient alleyways, learn about traditional architecture, and experience the vibrant culture of this UNESCO World Heritage site.",
            reviews: [ { id: 'r1', user: 'Ahmed K.', rating: 5, text: "Amazing experience! Learned so much.", media: [] }, { id: 'r2', user: 'Fatima S.', rating: 4, text: "Fun trail, well organized.", media: ['https://via.placeholder.com/100/aabbcc'] }, { id: 'r3', user: 'Omar B.', rating: 5, text: "Highly recommended for families.", media: [] }, ]
        }, {
            id: 2, imageUrl: 'https://via.placeholder.com/150/24f355', title: 'Riyadh Park Discovery Challenge', rating: 4.5, places: 5, joined: 870,
            description: "Explore the vast Riyadh Park through an interactive challenge. Find hidden spots, answer trivia about local flora, and enjoy the green spaces.",
            reviews: [ { id: 'r4', user: 'Layla M.', rating: 4, text: "Great way to spend an afternoon.", media: [] }, { id: 'r5', user: 'Youssef A.', rating: 5, text: "Kids loved the challenges!", media: ['https://via.placeholder.com/100/ccbbaa', 'https://via.placeholder.com/100/ddeeff'] }, ]
        },
        { id: 3, imageUrl: 'https://via.placeholder.com/150/d32776', title: 'Al Khobar Corniche Foodie Quest', rating: 4.9, places: 6, joined: 1500, description: "Taste your way along the Corniche! Find the best spots for local delicacies and international treats.", reviews: [] },
        { id: 4, imageUrl: 'https://via.placeholder.com/150/f66b97', title: 'Dammam Waterfront Art Walk', rating: 4.3, places: 7, joined: 640, description: "Discover stunning local art installations and sculptures dotted along the beautiful Dammam waterfront.", reviews: [] },
        { id: 5, imageUrl: 'https://via.placeholder.com/150/56a8c2', title: 'Understanding New City Projects', rating: null, places: 4, joined: 320, description: "Learn about the exciting upcoming developments and infrastructure projects shaping your city's future.", reviews: [] },
    ];
    // Duplicate quests for testing scrolling
    const quests = [
        ...baseQuests,
        { ...baseQuests[0], id: 6, title: "Jeddah Historic Repeat Quest" },
        { ...baseQuests[1], id: 7, title: "Riyadh Park Second Challenge" },
        { ...baseQuests[2], id: 8, title: "Al Khobar Foodie Again" },
        { ...baseQuests[3], id: 9, title: "Dammam Art Walk Encore" },
        { ...baseQuests[4], id: 10, title: "More City Projects Info" },
    ];
    // Apply filtering based on activeListFilter if needed
    const displayedQuests = quests.filter(quest => {
        if (activeListFilter === 'All') return true;
        // Add logic here if you need to filter by 'Official' or 'User'
        // e.g., if (activeListFilter === 'Official' && quest.isOfficial) return true;
        return true; // Placeholder
    });


    // --- Render ---
    return (
        <animated.div
            className="fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-30 overflow-hidden flex flex-col"
            style={{
                top: top,
                // Ensure height calculation allows content visibility
                // The height itself isn't as crucial as the `top` position for visibility
            }}
        >
            {/* --- Static Header Area (Always Visible) --- */}
            <div ref={headerRef} className="flex-shrink-0 border-b border-gray-200 bg-white rounded-t-2xl">
                {/* Handle (Clickable only when minimized to expand) */}
                <div
                    className="w-full h-5 flex justify-center items-center cursor-pointer pt-2"
                    onClick={isMinimized ? onExpandRequest : undefined}
                    title={isMinimized ? "Expand" : ""}
                >
                    <div className={`w-10 h-1 rounded-full ${isMinimized ? 'bg-cyan-500' : 'bg-gray-300'}`}></div>
                </div>

                {/* Back Button & Title Area (Only visible when EXPANDED) */}
                <div className={`px-4 pt-1 flex items-center min-h-[36px] ${isMinimized ? 'hidden' : ''}`}>
                    {/* Back Button: Show only if a quest is selected AND drawer is expanded */}
                    {selectedQuest ? (
                        <button
                            onClick={handleBackToList}
                            aria-label="Back to list"
                            className="text-gray-600 hover:text-cyan-600 p-1 -ml-1 mr-2 transition-colors"
                        >
                            <FiArrowLeft size={22} />
                        </button>
                    ) : (
                        // Spacer to keep title centered when back button isn't shown
                        <div className="w-8 flex-shrink-0"></div>
                    )}

                    {/* Title: Show Quest title ONLY when expanded AND a quest is selected */}
                    <h2 className="text-lg font-semibold text-gray-800 text-center truncate flex-grow px-1">
                        {selectedQuest ? selectedQuest.title : ''}
                    </h2>

                    {/* Spacer for balance */}
                    <div className="w-8 flex-shrink-0"></div>
                </div>


                {/* Search Bar and Category Filters Component */}
                {/* It now controls its own content based on isMinimized */}
                <SearchAndFilters
                    isMinimized={isMinimized}
                    onSearchFocus={onSearchFocusRequest} // Use the passed handler
                />
            </div>

            {/* --- Scrollable Content Area (Only visible when EXPANDED) --- */}
            <div
                ref={contentRef}
                className={`flex-grow overflow-y-auto drawer-content-scrollable ${isMinimized ? 'hidden' : 'block'}`}
            >
                {selectedQuest ? (
                    // ----- Render Quest Detail View -----
                    // Ensure QuestDetailView receives the quest data correctly
                    <QuestDetailView quest={selectedQuest} />

                ) : (
                    // ----- Render Quest List View -----
                    <>
                        {/* List Filters (e.g., All/Official/User, Popular/New) */}
                        {/* These only show when the list is visible (expanded and no quest selected) */}
                        <div className="px-4 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                            <div className="flex items-center space-x-3">
                                <button className={`text-sm font-medium flex items-center space-x-1 ${activeListFilter === 'All' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveListFilter('All')}> <FiGlobe size={16} /> <span>All</span></button>
                                <button className={`text-sm font-medium flex items-center space-x-1 ${activeListFilter === 'Official' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveListFilter('Official')}> <FiCheckCircle size={16} /> <span>Official</span></button>
                                <button className={`text-sm font-medium flex items-center space-x-1 ${activeListFilter === 'User' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveListFilter('User')}> <FiUserCheck size={16} /> <span>User</span></button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className={`text-xs font-medium flex items-center space-x-0.5 text-gray-500 hover:text-gray-700'}`}> <FiStar size={14} /> <span>Popular</span> </button>
                                <button className={`text-xs font-medium flex items-center space-x-0.5 text-gray-500 hover:text-gray-700'}`}> <FiTrendingUp size={14} /> <span>New</span> </button>
                            </div>
                        </div>

                        {/* Quest Card List */}
                        <div className="p-4 space-y-3">
                            {displayedQuests.map((quest) => (
                                <div key={quest.id} onClick={() => handleQuestSelect(quest)} className="cursor-pointer">
                                    <QuestCard
                                        imageUrl={quest.imageUrl}
                                        title={quest.title}
                                        rating={quest.rating}
                                        places={quest.places}
                                        joined={quest.joined}
                                        // No onClick needed here; parent div handles it
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Padding at the bottom */}
                        <div className="h-4"></div>
                    </> // End Fragment for list view
                )}
            </div> {/* End Scrollable Content Area */}
        </animated.div>
    );
}

export default InteractiveDrawer;