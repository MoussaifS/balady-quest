import React, { useRef, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

// Import other components and icons as before
import SearchAndFilters from './SearchAndFilters';
import { FiPlusCircle, FiPlay, FiBookOpen, FiMoon, FiCompass, FiCamera, FiMinusSquare, FiMap } from 'react-icons/fi';

// Helper function to get viewport height
const getViewportHeight = () => {
    if (typeof window !== 'undefined') {
        return window.innerHeight;
    }
    return 800; // Default height
};

// --- Re-paste the content components here ---
const AddPlaceBanner = () => (
    <div className="mx-4 my-3 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-between text-white shadow-md">
        <div>
            <h3 className="font-semibold">Add a Place</h3>
            <p className="text-sm opacity-90">Help us grow! Add a new place to make the app even better</p>
        </div>
        <FiPlusCircle size={30} className="opacity-80" />
    </div>
);

const WhatsNewSection = () => (
    <div className="px-4 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">What's new in Balady</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
             {/* Example Cards - Added key prop */}
            <div key="free-roam" className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg shadow-md flex flex-col justify-center items-center text-white p-2 text-center">
                <FiPlay size={24} className="mb-1" />
                <span className="text-xs font-medium">Free Roam</span>
            </div>
            <div key="carplay" className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-md flex flex-col justify-center items-center text-white p-2 text-center">
                <FiPlay size={24} className="mb-1" /> {/* Placeholder icon */}
                <span className="text-xs font-medium">Balady in CarPlay</span>
            </div>
            <div key="better-route" className="flex-shrink-0 w-36 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-md flex flex-col justify-center items-center text-white p-2 text-center">
                <FiPlay size={24} className="mb-1" /> {/* Placeholder icon */}
                <span className="text-xs font-medium">Better Route -12 min</span>
            </div>
            {/* Add more cards */}
        </div>
    </div>
);

const QuickActionsSection = () => (
    <div className="px-4 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick actions</h2>
        <div className="grid grid-cols-4 gap-x-2 gap-y-4 text-center">
             {/* Added key prop */}
            <button key="quests" className="flex flex-col items-center text-cyan-600 hover:bg-gray-100 p-1 rounded-md">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                    <FiMap size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700">Quests</span>
            </button>
            {/* --- Original Icons --- */}
             {/* Added key props */}
            <button key="quaran" className="flex flex-col items-center text-cyan-600 hover:bg-gray-100 p-1 rounded-md">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                    <FiBookOpen size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700">Quaran</span>
            </button>
            <button key="athkar" className="flex flex-col items-center text-cyan-600 hover:bg-gray-100 p-1 rounded-md">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                    <FiMoon size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700">Athkar</span>
            </button>
            <button key="qibla" className="flex flex-col items-center text-cyan-600 hover:bg-gray-100 p-1 rounded-md">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                    <FiCompass size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700">Qibla</span>
            </button>
            <button key="snap" className="flex flex-col items-center text-cyan-600 hover:bg-gray-100 p-1 rounded-md">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                    <FiCamera size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700">Snap & Send</span>
            </button>
            <button key="parking" className="flex flex-col items-center text-cyan-600 hover:bg-gray-100 p-1 rounded-md">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-1">
                    <FiMinusSquare size={20} /> {/* Placeholder for Parking */}
                </div>
                <span className="text-xs font-medium text-gray-700">Parking</span>
            </button>
            {/* Add more actions */}
        </div>
    </div>
);
// --- End of content components ---


// Main Draggable Drawer Component
function InteractiveDrawer() {
    const bottomNavHeight = 56; // Height of your bottom navigation bar in pixels
    const drawerHeaderHeight = 20; // Height of the drag handle area in pixels
    const closedHeightPeek = 160; // How much content (px) peeks out from bottom when closed

    // Calculate target Y positions (distance from the TOP of the viewport)
    const vh = getViewportHeight();
    // Adjusted openY: Lower this value (closer to 0) to open drawer higher up
    const openY = vh * 0.25; // Open state: drawer top at 25% of viewport height from top
    // Adjusted closedY: This is the distance from the TOP when closed
    const closedY = vh - bottomNavHeight - drawerHeaderHeight - closedHeightPeek;

    // --- react-spring Animation ---
    // Initialize spring with the calculated closedY position
    const [{ y }, api] = useSpring(() => ({
        y: closedY,
        config: { tension: 280, friction: 30 } // Default animation config
     }));
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false); // Track logical open/closed state

    // Reference for the scrollable content area
    const contentRef = useRef(null);

     // Effect to potentially update calculations if viewport resizes (optional but good practice)
     useEffect(() => {
        const handleResize = () => {
            const newVh = getViewportHeight();
            const newOpenY = newVh * 0.25;
            const newClosedY = newVh - bottomNavHeight - drawerHeaderHeight - closedHeightPeek;
            // Update spring immediately if drawer state requires it (or just recalculate for next drag)
            api.start({ y: isDrawerOpen ? newOpenY : newClosedY, immediate: true });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [api, isDrawerOpen, bottomNavHeight, drawerHeaderHeight, closedHeightPeek]); // Dependencies


    // --- react-use-gesture Drag Handler ---
    const bind = useDrag(
        ({
            last,
            memo = y.get(),
            movement: [, my],
            velocity: [, vy],
            direction: [, dy],
            cancel,
            active,
            event,
        }) => {
            let newY = memo + my;

            // --- Content Scrolling vs Drawer Dragging Logic ---
            const contentEl = contentRef.current;
            if (active && contentEl) {
                const contentScrollTop = contentEl.scrollTop;
                // If dragging UPWARDS (dy < 0) and content is scrolled to the TOP
                // OR dragging DOWNWARDS (dy > 0) and we are NOT at the top of the content scroll
                // then we prioritize CONTENT SCROLLING.
                if ( (dy < 0 && contentScrollTop > 0) || (dy > 0 && contentScrollTop > 0 /*&& newY < closedY*/ ) ) {
                     // If scrolling down inside the content, let the browser handle it, don't move the drawer
                     // This check is tricky; we want to drag drawer down *unless* content can scroll down more.
                     // Let's only cancel drag if scrolling *up* when not at top
                     if (dy < 0 && contentScrollTop > 0) {
                        // Don't move drawer if scrolling content up
                        return memo;
                     }
                }
                 // Allow dragging drawer down even if content is scrolled, unless content can *still* scroll down?
                 // The default browser behavior combined with `touch-action: none` on handle usually works okay here.
                 // Prioritize dragging the drawer itself unless actively scrolling within the content area.
            }

            // Clamp the position between fully open and fully closed states
            newY = Math.max(openY, Math.min(closedY, newY));

            if (last) {
                // Drag finished, decide where to snap
                const projectedY = newY + vy * 200; // Project position based on velocity
                let targetY = closedY; // Default to closing
                let shouldBeOpen = false;

                // Adjusted snap logic: Check projected position OR significant upward flick
                if (projectedY < (openY + closedY) / 1.8 || vy < -0.25) { // Made slightly easier to open
                    targetY = openY;
                    shouldBeOpen = true;
                } else {
                     targetY = closedY;
                     shouldBeOpen = false;
                }

                api.start({ y: targetY }); // Animate to target
                setIsDrawerOpen(shouldBeOpen); // Update logical state *after* animation starts
            } else {
                // While dragging, update position immediately
                api.start({ y: newY, immediate: true });
            }

            return memo;
        },
        {
            from: () => [0, y.get()],
            // Prevent scroll on the PAGE when dragging handle,
            // but allow scroll *within* the content div when appropriate.
            preventScroll: true, // Prevent page scroll
            axis: 'y', // Explicitly lock to y-axis
            // bounds: { top: openY, bottom: closedY } // Alternative way to set limits
        }
    );

    // Toggle drawer state on handle click
    const handleHandleClick = () => {
        const targetY = isDrawerOpen ? closedY : openY;
        api.start({ y: targetY });
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Effect to control content scrollability based on drawer position
    // useEffect(() => {
    //     const contentEl = contentRef.current;
    //     if (contentEl) {
    //         // Allow scrolling only when fully open or very close to it
    //         const isEffectivelyOpen = y.get() < openY + 20; // Check if current position is near open state
    //         contentEl.style.overflowY = isEffectivelyOpen ? 'auto' : 'hidden';
    //     }
    //     // This effect should run whenever the spring value changes
    //     // We subscribe to the spring value to trigger this check accurately
    //     const unsubscribe = y.onChange(() => {
    //          const contentEl = contentRef.current;
    //          if (contentEl) {
    //              const isEffectivelyOpen = y.get() < openY + 20;
    //              contentEl.style.overflowY = isEffectivelyOpen ? 'auto' : 'hidden';
    //          }
    //     });
    //     return unsubscribe; // Cleanup subscription on unmount

    // }, [y, openY]); // Depend on spring value `y` and `openY` threshold

        // Effect to control content scrollability based on drawer position
        useEffect(() => {
            const contentEl = contentRef.current;
            if (contentEl) {
                // Get the current numerical value from the spring animation
                const currentY = y.get();
                // Determine if the drawer is close enough to the open position to allow scrolling
                const isEffectivelyOpen = currentY < openY + 50; // Increased tolerance slightly
    
                // Set the overflow style based on the condition
                contentEl.style.overflowY = isEffectivelyOpen ? 'auto' : 'hidden';
    
                // Optional: Log state for debugging
                // console.log(`useEffect - currentY: ${currentY.toFixed(2)}, openY: ${openY.toFixed(2)}, isScrollable: ${isEffectivelyOpen}`);
            }
            // This effect depends on the 'y' spring value and the 'openY' threshold.
            // It will re-run whenever 'y' changes during the animation or 'openY' changes (e.g., on resize).
        }, [y, openY]); // Dependency array includes the spring value 'y'

    return (
        // Use animated.div for the spring animation
        <animated.div
            className="fixed top-0 left-0 right-0 h-screen bg-white rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.2)] z-30 touch-none overflow-hidden" // Apply touch-none here too for safety
            style={{
                transform: y.to(yVal => `translateY(${yVal}px)`), // Directly use y for translation
                // Height is fixed to screen height, transform moves it into view
            }}
        >
            {/* Drawer Handle - Apply drag handler here */}
            <div
                {...bind()} // Spread the drag properties onto the handle
                className="w-full h-5 flex justify-center items-center cursor-grab active:cursor-grabbing"
                // onClick={handleHandleClick} // Enable click toggle if desired
                style={{ touchAction: 'pan-y' }} // Specifically allow vertical pan on handle
            >
                <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Scrollable Content Area */}
            {/* Subtract handle height from the total available height */}
            <div
                ref={contentRef}
                className="h-[calc(100%-1.25rem)]" // Height is 100% minus handle height
                style={{
                    overflowY: 'hidden', // Default to hidden, controlled by useEffect
                    touchAction: 'auto' // Allow normal touch actions (scrolling) within content
                 }}
            >
                <SearchAndFilters />
                {/* Keep existing content structure */}
                 <AddPlaceBanner />
                 <WhatsNewSection />
                 <QuickActionsSection />
                <div className="h-20"></div> {/* More Padding at the bottom for scroll clearance */}
            </div>
        </animated.div>
    );
}

export default InteractiveDrawer;