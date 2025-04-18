import React from 'react'; // Removed useState
import MapView from './components/MapView';
import MapOverlays from './components/MapOverlays';
// SearchAndFilters is now *inside* InteractiveDrawer
import InteractiveDrawer from './components/InteractiveDrawer';
import BottomNavigationBar from './components/BottomNavigationBar';

function App() {
  // No need for isDrawerOpen or toggleDrawer here anymore

  return (
    <div className="relative h-screen w-screen flex flex-col bg-white overflow-hidden">

      {/* Map Area - takes remaining space */}
      <div className="flex-grow relative">
        <MapView />
        {/* Overlays need to be aware of the drawer potentially */}
        {/* Ensure MapOverlays have appropriate z-index (e.g., z-10 or z-20) */}
        {/* if they should appear above the map but below the drawer */}
        <MapOverlays />
      </div>

      {/* Removed static SearchAndFilters positioning */}

      {/* Interactive Drawer - Self-managing */}
      <InteractiveDrawer />

      {/* Bottom Navigation - Ensure it has highest z-index if needed (e.g., z-40) */}
      <BottomNavigationBar />
    </div>
  );
}

export default App;