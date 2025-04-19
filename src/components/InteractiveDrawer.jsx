// src/components/InteractiveDrawer.jsx

import React, { useRef, useEffect, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

// Import Child Components
import FilterChip from './FilterChip';
import QuestCard from './QuestCard';
import QuestDetailView from './QuestDetailView'; // Detail view component

// Import Icons
import {
    FiMap, FiStar, FiMapPin, FiUsers, FiFilter, FiAward, FiTrendingUp,
    FiCheckCircle, FiUserCheck, FiGlobe, FiPocket, FiHeart, FiArrowLeft
} from 'react-icons/fi';

// Helper function to get viewport height
const getViewportHeight = () => {
    if (typeof window !== 'undefined') {
        return window.innerHeight;
    }
    return 800; // Default height
};


// --- Main Draggable Drawer Component ---
function InteractiveDrawer() {
    // --- State Definitions ---
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeToggle, setActiveToggle] = useState('all');
    const [activeSort, setActiveSort] = useState('popular');
    const [selectedQuest, setSelectedQuest] = useState(null);

    // --- Refs ---
    const contentRef = useRef(null);

    // --- Drawer Animation & Position Calculation ---
    const bottomNavHeight = 56;
    const stickyHeaderHeight = 68; // Handle + Title Area approx height
    const closedHeightPeek = 80;  // How much content peeks out when closed
    const drawerHeaderHeight = 20; // Height of the handle itself for calc

    const vh = getViewportHeight();
    const openY = vh * 0.25; // Open state: drawer top at 25% of viewport height
    const closedY = vh - bottomNavHeight - drawerHeaderHeight - closedHeightPeek; // Correct calc

    const [{ y }, api] = useSpring(() => ({
        y: closedY, // Start closed
        config: { tension: 280, friction: 30 }
    }));
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // --- Handlers ---
    const handleQuestSelect = (quest) => {
      setSelectedQuest(quest);
      api.start({ y: openY }); // Force open
      setIsDrawerOpen(true);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0; // Reset scroll on view change
      }
    };

    const handleBackToList = () => {
      setSelectedQuest(null);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0; // Reset scroll on view change
      }
      // Decide if drawer should stay open or animate closed/partially closed
      // api.start({ y: closedY }); // Example: close it
      // setIsDrawerOpen(false);
    };

    // --- Effects ---
    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            const newVh = getViewportHeight();
            const newOpenY = newVh * 0.25;
            const newClosedY = newVh - bottomNavHeight - drawerHeaderHeight - closedHeightPeek;
            // Update spring position based on current logical state and new dimensions
            api.start({ y: isDrawerOpen ? newOpenY : newClosedY, immediate: true });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [api, isDrawerOpen, bottomNavHeight, drawerHeaderHeight, closedHeightPeek]); // Ensure all dependencies are included

    // Scroll control effect - Enables/disables overflowY based on drawer position
    useEffect(() => {
        const contentEl = contentRef.current;
        if (contentEl) {
            const currentY = y.get();
            // Enable scrolling when drawer is open or very close to open
            const isEffectivelyOpen = currentY < openY + 50;
            contentEl.style.overflowY = isEffectivelyOpen ? 'auto' : 'hidden';
        }
        // This effect correctly depends on the spring value 'y' itself
    }, [y, openY]);


    // --- Drag Handler (Revised Logic for Content Scrolling) ---
    const bind = useDrag(
        ({
            first, last, memo = y.get(), movement: [, my], velocity: [, vy],
            direction: [, dy], event, target, active, tap, cancel
        }) => {
            if (tap) return memo; // Ignore simple taps

            const currentYPos = y.get();
            const contentEl = contentRef.current;
            const isEffectivelyOpen = currentYPos <= openY + 15; // Is drawer visually open?

            // Determine if the event target is within the scrollable content
            let isTargetInScrollableContent = contentEl?.contains(target) ?? false;

            // Log Start Info
            if (active && first) {
                console.log(`--- Drag Start --- Target in Content: ${isTargetInScrollableContent}, Drawer Open: ${isEffectivelyOpen}, ScrollTop: ${contentEl?.scrollTop.toFixed(0)}`);
            }

            // --- Prioritize Content Scrolling ---
            if (active && isEffectivelyOpen && isTargetInScrollableContent) {
                 // Check if the content element itself can scroll in the drag direction
                const canScrollUp = (contentEl?.scrollTop ?? 0) > 0;
                const canScrollDown = contentEl ? (contentEl.scrollTop + contentEl.clientHeight < contentEl.scrollHeight - 1) : false;
                const isDraggingUp = dy < 0;
                const isDraggingDown = dy > 0;

                // If trying to scroll in a direction the content CAN scroll, let native scroll handle it.
                if ( (isDraggingUp && canScrollUp) || (isDraggingDown && canScrollDown) ) {
                    console.log(">>> Allowing Native Scroll <<<");
                    // Prevent the drawer from moving by returning the memoized position
                    return memo;
                }
                 // If content cannot scroll further in that direction (boundary reached), the gesture might
                 // be intended to drag the drawer (e.g., drag down from top to close). Allow default logic below.
                 console.log(">>> Content boundary reached or cannot scroll, potentially dragging drawer. <<<")
            }

            // --- Default Drawer Dragging Logic ---
            // Proceeds if not returned above
            // console.log(">>> Moving Drawer <<<"); // Uncomment for debugging drawer movement
            let newY = memo + my;
            newY = Math.max(openY, Math.min(closedY, newY)); // Clamp

            if (last) {
                console.log("--- Drag End ---");
                // --- Snapping Logic ---
                const projectedY = newY + vy * 200;
                let targetY = closedY;
                let shouldBeOpen = false;
                // Allow closing detail view with a reasonable downward swipe
                 if (selectedQuest && isDrawerOpen && dy > 0 && (vy > 0.3 || my > vh * 0.15) ) {
                     targetY = closedY; shouldBeOpen = false; handleBackToList(); // Go back to list on close swipe
                 } else if (projectedY < (openY + closedY) / 1.8 || vy < -0.25) { // Bias towards opening
                    targetY = openY; shouldBeOpen = true;
                 } else if (!selectedQuest) { // Only snap closed from list view
                    targetY = closedY; shouldBeOpen = false;
                 } else { // Default to stay open if in detail view & not swiped down hard
                    targetY = openY; shouldBeOpen = true;
                }
                api.start({ y: targetY });
                setIsDrawerOpen(shouldBeOpen);

            } else if (active) { // Only update spring if actively dragging
                api.start({ y: newY, immediate: true });
            }
            return memo; // Return memoized position for next frame
        },
        {
            from: () => [0, y.get()],
            filterTaps: true,
            preventScroll: true, // Prevent page scroll when dragging the *handle*
            axis: 'y',
            pointer: { touch: true } // Capture touch events
        }
    );


    // --- Mock Data (Ensure enough items to scroll) ---
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
    const displayedQuests = quests; // Use the extended list


    // --- Render ---
    return (
        <animated.div
            className="fixed top-0 left-0 right-0 h-screen bg-white rounded-t-2xl shadow-2xl z-30 touch-none overflow-hidden" // touch-none on main container helps prevent page scroll
            style={{
                transform: y.to(yVal => `translateY(${yVal}px)`),
            }}
        >
            {/* --- Sticky Header --- */}
            <div className="sticky top-0 left-0 right-0 bg-white z-10">
                {/* Handle */}
                <div
                    {...bind()} // Drag handler bound primarily to the handle
                    className="w-full h-5 flex justify-center items-center cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'pan-y' }} // Explicitly allow vertical panning on handle
                >
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>
                {/* Title Area */}
                <div className="px-4 pb-3 pt-1 border-b border-gray-200 flex items-center justify-between min-h-[48px]">
                     {selectedQuest ? (
                        <button onClick={handleBackToList} aria-label="Back to list" className="text-gray-600 hover:text-cyan-600 p-1 -ml-1 mr-2 transition-colors">
                            <FiArrowLeft size={22} />
                        </button>
                    ) : ( <div className="w-8 flex-shrink-0"></div> )}

                    <h2 className="text-lg font-semibold text-gray-800 text-center truncate flex-grow px-1">
                        {selectedQuest ? selectedQuest.title : <div className="px-4 pt-4 pb-3 overflow-x-auto whitespace-nowrap">
                            <div className="flex space-x-2">
                                {filters.map((filter) => (
                                    <FilterChip key={filter.id} {...filter} isActive={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)} />
                                ))}
                            </div>
                        </div>}
                    </h2>

                     <div className="w-8 flex-shrink-0"></div>
                </div>
            </div>


            {/* --- Scrollable Content Area --- */}
            <div
                ref={contentRef}
                // Apply custom scrollbar class
                className={`h-[calc(100%-68px)] drawer-content-scrollable`}
                style={{
                     overflowY: 'hidden', // Controlled by useEffect based on drawer state
                     touchAction: 'auto' // Allow default touch actions (like scroll) within this element
                }}
            >
                {selectedQuest ? (
                    // ----- Render Quest Detail View -----
                    <QuestDetailView quest={selectedQuest} />
                ) : (
                    // ----- Render Quest List View -----
                    <>
                        {/* Filter Chips */}
                        <div className="px-4 pt-4 pb-3 overflow-x-auto whitespace-nowrap">
                            <div className="flex space-x-2">
                                {filters.map((filter) => (
                                    <FilterChip key={filter.id} {...filter} isActive={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)} />
                                ))}
                            </div>
                        </div>

                        {/* Content Type Toggles */}
                        <div className="px-4 py-2 border-t border-b border-gray-200 flex items-center justify-around">
                             <button onClick={() => setActiveToggle('official')} className={`flex items-center space-x-1 py-1 px-2 rounded text-sm transition-colors ${activeToggle === 'official' ? 'text-cyan-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}> <FiCheckCircle size={16} /> <span>Official</span> </button>
                             <div className="h-4 w-px bg-gray-200"></div>
                             <button onClick={() => setActiveToggle('user')} className={`flex items-center space-x-1 py-1 px-2 rounded text-sm transition-colors ${activeToggle === 'user' ? 'text-cyan-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}> <FiUserCheck size={16} /> <span>User</span> </button>
                             <div className="h-4 w-px bg-gray-200"></div>
                             <button onClick={() => setActiveToggle('all')} className={`flex items-center space-x-1 py-1 px-2 rounded text-sm transition-colors ${activeToggle === 'all' ? 'text-cyan-600 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}> <FiGlobe size={16} /> <span>All</span> </button>
                        </div>

                         {/* Sorting Options */}
                         <div className="px-4 pt-3 pb-2 flex justify-end items-center space-x-3">
                            <button onClick={() => setActiveSort('popular')} className={`text-xs font-medium flex items-center space-x-0.5 ${activeSort === 'popular' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`}> <FiStar size={14} /> <span>Popular</span> </button>
                            <button onClick={() => setActiveSort('new')} className={`text-xs font-medium flex items-center space-x-0.5 ${activeSort === 'new' ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`}> <FiTrendingUp size={14} /> <span>New</span> </button>
                         </div>

                         {/* Quest Card List */}
                         <div className="px-4 pb-4 space-y-3">
                            {displayedQuests.map((quest) => (
                                <div key={quest.id} onClick={() => handleQuestSelect(quest)} className="cursor-pointer">
                                     <QuestCard
                                         imageUrl={quest.imageUrl}
                                         title={quest.title}
                                         rating={quest.rating}
                                         places={quest.places}
                                         joined={quest.joined}
                                     />
                                </div>
                             ))}
                         </div>

                         {/* Padding at the bottom */}
                         <div className="h-20"></div> {/* More bottom padding */}
                     </> // End Fragment for list view
                )}
            </div>
        </animated.div>
    );
}

export default InteractiveDrawer;