import React from 'react';
import { FiLayers, FiPlus, FiMinus, FiNavigation, FiSun, FiMap } from 'react-icons/fi';
import { useMap } from 'react-leaflet'; // Import useMap

function MapOverlays({ bottomNavHeight, minimizedDrawerPeekHeight, isDrawerMinimized }) {
    const map = useMap(); // Get the map instance from context

    const navButtonBottomOffset = bottomNavHeight + (isDrawerMinimized ? minimizedDrawerPeekHeight : 20) + 16;

    const handleZoomIn = () => {
        if (map) {
            map.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (map) {
            map.zoomOut();
        }
    };

    const handleLocateMe = () => {
        if (map) {
            map.locate({ setView: true, maxZoom: 16 }); // Find user location and center map
            // You might want to add event listeners for locationfound/locationerror
            map.once('locationfound', (e) => {
                console.log('Location found:', e.latlng);
                // Optional: Add a marker at the user's location
                // L.marker(e.latlng).addTo(map).bindPopup("You are here!").openPopup();
            });
            map.once('locationerror', (e) => {
                console.error('Location error:', e.message);
                alert('Error finding location: ' + e.message);
            });
        }
    };

    const handleToggleLayers = () => {
        console.log("Toggle Layers clicked - (Implementation specific)");
        // Example: You might have different TileLayer components to switch between
    };

    const handleToggleTraffic = () => {
        console.log("Toggle Traffic clicked - (Requires a traffic layer source)");
        // Mapbox traffic requires specific setup, often a different style or data source
    };


    return (
        <>
            {/* Top Left Overlay (Weather) - No changes needed */}
            <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md flex items-center space-x-1.5 text-sm z-[1000]">
                <FiSun className="text-orange-500" size={18}/>
                <span className='font-medium text-gray-700'>29°</span>
            </div>

            {/* Right Side Overlays (Layers, Traffic, Zoom) */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
                {/* Layers Button */}
                <button onClick={handleToggleLayers} className="bg-white p-3 rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-colors">
                    <FiLayers size={20} />
                </button>
                {/* Traffic Button Example */}
                <button onClick={handleToggleTraffic} className="bg-white p-3 rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-colors">
                    <FiMap size={20} />
                </button>

                {/* Zoom Buttons - Now functional */}
                <div className="flex flex-col shadow-md rounded-lg overflow-hidden mt-2">
                    <button onClick={handleZoomIn} className="bg-white p-3 text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200">
                        <FiPlus size={20} />
                    </button>
                    <button onClick={handleZoomOut} className="bg-white p-3 text-gray-700 hover:bg-gray-100 transition-colors">
                        <FiMinus size={20} />
                    </button>
                </div>
            </div>


            {/* Bottom Right Overlays (Navigation/Locate) */}
            <div
                className="absolute right-4 flex flex-col space-y-3 z-[1000] transition-all duration-300 ease-in-out"
                style={{ bottom: `${navButtonBottomOffset}px` }}
            >
                {/* Locate Button - Now functional */}
                <button onClick={handleLocateMe} className="bg-white p-3.5 rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-colors">
                    <FiNavigation size={20} className="transform rotate-45"/>
                </button>
            </div>
        </>
    );
}


// Wrap MapOverlays to provide the Map Context ONLY WHEN needed inside MapContainer
// This prevents errors when MapOverlays might be rendered outside a MapContainer context (though unlikely in this setup)
function MapOverlaysWrapper(props) {
    const map = useMap(); // Check if we are inside a map context
    if (!map) {
        // console.warn("MapOverlays rendered outside of MapContainer context");
        return null; // Don't render overlays if there's no map
    }
    return <MapOverlays {...props} />;
}


export default MapOverlaysWrapper; // Export the wrapper