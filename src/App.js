import React, { useState, useCallback } from 'react';
import MapView from './components/MapView';
import InteractiveDrawer from './components/InteractiveDrawer';
import BottomNavigationBar from './components/BottomNavigationBar';

const BOTTOM_NAV_HEIGHT = 56; // Standard bottom nav height
// INCREASED Peek Height: Needs space for Handle (~20px) + Categories (~50px) + Search (~50px) + Padding (~10-20px)
const MINIMIZED_DRAWER_PEEK_HEIGHT = 90; // Adjust this value as needed based on exact styling

function App() {
    const [isDrawerMinimized, setIsDrawerMinimized] = useState(true); // Start minimized

    const handleMapClick = useCallback(() => {
        console.log("Map clicked, minimizing drawer.");
        // Only minimize if it's not already minimized
        if (!isDrawerMinimized) {
            setIsDrawerMinimized(true);
        }
    }, [isDrawerMinimized]);

    const handleExpandRequest = useCallback(() => {
        console.log("Expand requested, maximizing drawer.");
        // Only expand if it's not already expanded
        if (isDrawerMinimized) {
            setIsDrawerMinimized(false);
        }
    }, [isDrawerMinimized]);

    // Also allow expanding by focusing search when minimized
    const handleSearchFocus = useCallback(() => {
        if (isDrawerMinimized) {
            console.log("Search focused while minimized, expanding drawer.");
            setIsDrawerMinimized(false);
        }
    },[isDrawerMinimized]);

    return (
        <div className="relative h-screen w-screen flex flex-col bg-gray-800 overflow-hidden">
            <div className="flex-grow relative">
                {/* Map View */}
                <MapView
                    onMapClick={handleMapClick}
                    isDrawerMinimized={isDrawerMinimized}
                    bottomNavHeight={BOTTOM_NAV_HEIGHT}
                    minimizedDrawerPeekHeight={MINIMIZED_DRAWER_PEEK_HEIGHT}
                />
            </div>

            {/* Interactive Drawer */}
            <InteractiveDrawer
                isMinimized={isDrawerMinimized}
                onExpandRequest={handleExpandRequest}
                onSearchFocusRequest={handleSearchFocus} // Pass search focus handler
                bottomNavHeight={BOTTOM_NAV_HEIGHT}
                minimizedDrawerPeekHeight={MINIMIZED_DRAWER_PEEK_HEIGHT}
            />

            {/* Bottom Navigation */}
            <BottomNavigationBar />
        </div>
    );
}

export default App;