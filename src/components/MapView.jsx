// src/components/map/MapView.js
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapOverlaysWrapper from './MapOverlays';

// --- Icon Fix (Keep as is) ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'), // Use require if imports fail
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// --- End Icon Fix ---

// --- Mapbox Configuration (Keep as is) ---
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || "YOUR_MAPBOX_ACCESS_TOKEN"; // Add fallback or error if missing
const MAPBOX_STYLE_ID = 'dark-v11'; // Or your preferred style
const MAPBOX_USERNAME = 'mapbox'; // Or your username if using custom style
if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "YOUR_MAPBOX_ACCESS_TOKEN") {
    console.warn("Mapbox Token is missing or using placeholder! Map tiles may not load.");
}
const mapboxTileUrl = `https://api.mapbox.com/styles/v1/${MAPBOX_USERNAME}/${MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;
const mapboxAttribution = `© <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors`;
// --- End Mapbox Configuration ---

// --- MapEvents Component (Keep as is) ---
function MapEvents({ onMapClick }) {
    const map = useMap();
    useEffect(() => {
        if (!map || !onMapClick) return;
        const handleClick = (e) => {
            // Prevent click trigger on markers, popups, controls
            if (e.originalEvent.target.closest('.leaflet-marker-icon, .leaflet-popup, .leaflet-control, .map-overlay-button')) { // Added class for overlays
                return;
            }
            onMapClick(e);
        };
        map.on('click', handleClick);
        return () => { map.off('click', handleClick); };
    }, [map, onMapClick]);
    return null;
}
// --- End MapEvents ---

// --- ExperienceMapLayer Component (UPDATED) ---
function ExperienceMapLayer({ experience, progress }) {
    const map = useMap();

    // Effect for initial fitting and centering on step change
    useEffect(() => {
        if (!experience || !map) return;

        const isKunuz = experience.type === 'Kunuz';
        const points = isKunuz ? experience.steps : experience.path;

        if (!points || points.length === 0) return;

        const locations = points.map(p => p.location).filter(loc => loc && loc.length === 2); // Ensure valid locations

        if (locations.length === 0) return;

        // --- Initial Fit Bounds ---
        // Only fit bounds when the experience first loads (progress is null or step 0)
        // Or when viewing passively (progress is null)
        if (!progress || progress.currentStepIndex === 0) {
            try {
                const bounds = L.latLngBounds(locations);
                if (bounds.isValid()) {
                    console.log("Fitting map bounds to experience:", experience.id);
                    map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 17 }); // Fly smoothly, add padding
                } else if (locations.length === 1) {
                    console.log("Flying to single point:", experience.id);
                    map.flyTo(locations[0], 17); // Fly to single point with zoom
                }
            } catch (error) {
                console.error("Error calculating or fitting bounds:", error);
                if(locations.length > 0) map.flyTo(locations[0], 15); // Fallback to first point
            }
        }
        // --- Fly to Current Step ---
        else if (isKunuz && progress && progress.currentStepIndex < points.length) {
            const currentStepLocation = points[progress.currentStepIndex]?.location;
            if (currentStepLocation && currentStepLocation.length === 2) {
                console.log("Flying to current step:", progress.currentStepIndex, currentStepLocation);
                // Don't fly if the map view already contains the point (avoids jumpiness)
                if (!map.getBounds().contains(currentStepLocation)) {
                    map.flyTo(currentStepLocation, map.getZoom() < 16 ? 17 : map.getZoom()); // Zoom in if far away
                } else {
                    // Optionally pan smoothly if needed, but flyTo is usually better
                    // map.panTo(currentStepLocation);
                }
            }
        }

        // Rerun when experience changes OR current step index changes
    }, [experience, progress?.currentStepIndex, map]);


    if (!experience) return null;

    const isKunuz = experience.type === 'Kunuz';
    const currentStepIndex = progress?.currentStepIndex ?? -1; // Default to -1 if no progress
    const points = isKunuz ? experience.steps : experience.path;

    if (!points || points.length === 0) return null;

    // --- Render Masarat Path ---
    if (!isKunuz) {
        const pathLocations = points.map(p => p.location).filter(loc => loc && loc.length === 2);
        return (
            <>
                {pathLocations.length > 1 && <Polyline positions={pathLocations} color="teal" weight={4} opacity={0.8} />}
                {points.map((stop, index) => {
                    if (!stop.location || stop.location.length !== 2) return null; // Skip invalid points
                    return (
                        <CircleMarker
                            key={stop.id || `masarat-stop-${index}`}
                            center={stop.location}
                            radius={8}
                            pathOptions={{ color: 'white', weight: 2, fillColor: 'teal', fillOpacity: 1 }}
                        >
                            <Popup autoPan={false}> {/* Disable autoPan if flyTo is handled */}
                                <b>{index + 1}. {stop.title}</b><br />
                                {stop.description}
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </>
        );
    }

    // --- Render Kunuz Steps ---
    if (isKunuz) {
        return (
            <>
                {points.map((step, index) => {
                    if (!step.location || step.location.length !== 2) return null; // Skip invalid points
                    const isCompleted = !!progress?.completedSteps?.[step.id];
                    const isCurrent = index === currentStepIndex;
                    // isUpcoming is not used for styling here, but could be

                    let color = '#9ca3af'; // Gray-400 (Upcoming/Default)
                    let radius = 6;
                    let opacity = 0.7;
                    let weight = 1;
                    let zIndexOffset = 100; // Base z-index

                    if (isCompleted) {
                        color = '#10b981'; // Emerald-500 (Completed)
                        radius = 7;
                        opacity = 0.9;
                        weight = 2;
                        zIndexOffset = 200;
                    }
                    if (isCurrent) {
                        color = '#06b6d4'; // Cyan-500 (Current step)
                        radius = 10;
                        opacity = 1.0;
                        weight = 2;
                        zIndexOffset = 1000; // Bring current step to front
                    }

                    return (
                        <CircleMarker
                            key={step.id || `kunuz-step-${index}`}
                            center={step.location}
                            radius={radius}
                            // Bring current/completed markers slightly forward
                            zIndexOffset={zIndexOffset}
                            pathOptions={{
                                color: 'white', weight: weight, fillColor: color, fillOpacity: opacity,
                            }}
                        >
                            <Popup autoPan={false}> {/* Disable autoPan */}
                                <b>Step {index + 1} {isCurrent ? '(Current)' : isCompleted ? '(Completed)' : ''}</b><br />
                                <span className='italic'>{step.hint}</span><br/>
                                <span className='text-xs text-gray-500'>Type: {step.type}</span>
                            </Popup>
                        </CircleMarker>
                    );
                })}
                {/* Optional: Draw lines between completed/current steps */}
                {/* Add Polyline logic here if desired */}
            </>
        );
    }

    return null; // No layer to render
}


// --- Main MapView Component (UPDATED) ---
function MapView({
                     onMapClick,
                     isDrawerMinimized,
                     bottomNavHeight,
                     minimizedDrawerPeekHeight,
                     currentView,
                     selectedExperience,
                     activeQuestProgress,
                 }) {
    const defaultPosition = [24.774265, 46.738586]; // Riyadh Center (Example)
    const mapRef = useRef();

    // Determine initial center/zoom based on context if needed
    // Example: Center on user location if available, otherwise default
    const [center, setCenter] = useState(defaultPosition);
    const [zoom, setZoom] = useState(13); // Start slightly more zoomed out

    // Note: Automatic centering/zooming is now primarily handled within ExperienceMapLayer

    return (
        <MapContainer
            center={center} // Use state for initial center
            zoom={zoom}     // Use state for initial zoom
            scrollWheelZoom={true}
            className="absolute inset-0 z-0 map-container-class" // Added class
            zoomControl={false} // Using custom overlays
            ref={mapRef} // Assign ref directly if needed outside MapContainer context
            // Use whenCreated if you MUST have the instance immediately (less common now with hooks)
            // whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
            {MAPBOX_TOKEN && MAPBOX_TOKEN !== "YOUR_MAPBOX_ACCESS_TOKEN" ? (
                <TileLayer
                    attribution={mapboxAttribution}
                    url={mapboxTileUrl}
                />
            ) : (
                // Basic fallback tile layer
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                // Or show a message:
                // <div style={{ position:'absolute', inset: 0, background: '#555', color:'white', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 }}>Map requires configuration</div>
            )}

            <MapEvents onMapClick={onMapClick} />

            {/* Render Experience Layer */}
            {/* Always render, let it handle visibility/data internally */}
            <ExperienceMapLayer
                experience={selectedExperience}
                progress={activeQuestProgress}
            />


            {/* Render Overlays */}
            <MapOverlaysWrapper
                bottomNavHeight={bottomNavHeight}
                minimizedDrawerPeekHeight={minimizedDrawerPeekHeight}
                isDrawerMinimized={isDrawerMinimized}
                currentView={currentView} // Pass view to overlays if needed
            />

        </MapContainer>
    );
}

export default MapView;