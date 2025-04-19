import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from 'react-leaflet'; // Added Polyline, CircleMarker
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapOverlaysWrapper from './MapOverlays';

// --- Icon Fix (Keep this as before) ---
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl, iconUrl: iconUrl, shadowUrl: shadowUrl,
});
// --- End Icon Fix ---

// --- Mapbox Configuration (Keep this as before) ---
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const MAPBOX_STYLE_ID = 'dark-v11';
const MAPBOX_USERNAME = 'mapbox';
console.log("Mapbox Token:", MAPBOX_TOKEN); // Debugging line to check if token is set
// if (!MAPBOX_TOKEN) { console.error("Mapbox Token missing!"); }
const mapboxTileUrl = `https://api.mapbox.com/styles/v1/${MAPBOX_USERNAME}/${MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`;
const mapboxAttribution = `© <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors`;
// --- End Mapbox Configuration ---

// --- MapEvents Component (Keep this as before) ---
function MapEvents({ onMapClick }) {
    const map = useMap();
    useEffect(() => {
        if (!map || !onMapClick) return;
        const handleClick = (e) => {
            const targetElement = e.originalEvent.target;
            if (
                targetElement.closest('.leaflet-marker-icon') ||
                targetElement.closest('.leaflet-control') ||
                targetElement.closest('.leaflet-popup') ||
                targetElement.closest('button') // Include overlay buttons check
            ) {
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

// --- NEW: ExperienceMapLayer Component ---
function ExperienceMapLayer({ experience, progress }) {
    const map = useMap();

    useEffect(() => {
        if (!experience || !map) return;

        let bounds;
        if (experience.type === 'Masarat' && experience.path?.length > 0) {
            const pathLocations = experience.path.map(p => p.location);
            if (pathLocations.length > 0) {
                bounds = L.latLngBounds(pathLocations);
            }
        } else if (experience.type === 'Kunuz' && experience.steps?.length > 0) {
            const stepLocations = experience.steps.map(s => s.location);
            if (stepLocations.length > 0) {
                bounds = L.latLngBounds(stepLocations);
            }
        }

        if (bounds && bounds.isValid()) {
            // map.fitBounds(bounds, { padding: [50, 50] }); // Zoom to fit all points with padding
        } else if (experience.path?.[0]?.location || experience.steps?.[0]?.location) {
            // Fallback: Center on the first point if bounds are not valid
            // map.setView(experience.path?.[0]?.location || experience.steps[0].location, 15);
        }
        // Re-center logic might be needed when switching views or experiences
        // console.log("Fitting bounds for experience:", experience.id);

    }, [experience, map]); // Rerun when experience changes

    if (!experience) return null;

    const isKunuz = experience.type === 'Kunuz';
    const currentStepIndex = progress?.currentStepIndex ?? -1; // Default to -1 if no progress

    // --- Render Masarat Path ---
    if (!isKunuz && experience.path?.length > 0) {
        const pathLocations = experience.path.map(p => p.location);
        return (
            <>
                {/* Draw the full polyline */}
                <Polyline positions={pathLocations} color="teal" weight={4} opacity={0.8} />
                {/* Draw markers for each stop */}
                {experience.path.map((stop, index) => (
                    <CircleMarker
                        key={stop.id}
                        center={stop.location}
                        radius={8}
                        pathOptions={{
                            color: 'white',
                            weight: 2,
                            fillColor: 'teal', // Use teal for Masarat
                            fillOpacity: 1,
                        }}
                    >
                        <Popup>
                            <b>{index + 1}. {stop.title}</b><br />
                            {stop.description}
                        </Popup>
                    </CircleMarker>
                ))}
            </>
        );
    }

    // --- Render Kunuz Steps ---
    if (isKunuz && experience.steps?.length > 0) {
        return (
            <>
                {experience.steps.map((step, index) => {
                    const isCompleted = progress?.completedSteps?.[step.id];
                    const isCurrent = index === currentStepIndex;
                    const isUpcoming = index > currentStepIndex;

                    let color = 'gray'; // Upcoming
                    let radius = 5;
                    let opacity = 0.6;
                    if (isCompleted) {
                        color = 'green'; // Completed
                        radius = 6;
                        opacity = 0.8;
                    }
                    if (isCurrent) {
                        color = 'cyan'; // Current step
                        radius = 10;
                        opacity = 1.0;
                    }

                    // Only show current and completed steps? Or all? Show all for now.
                    // if (isUpcoming) return null; // Option to hide upcoming steps

                    return (
                        <CircleMarker
                            key={step.id}
                            center={step.location}
                            radius={radius}
                            pathOptions={{
                                color: 'white', // Outline
                                weight: 2,
                                fillColor: color,
                                fillOpacity: opacity,
                            }}
                        >
                            <Popup>
                                <b>Step {index + 1} {isCurrent ? '(Current)' : isCompleted ? '(Completed)' : ''}</b><br />
                                Hint: {step.hint}<br/>
                                Type: {step.type}
                            </Popup>
                        </CircleMarker>
                    );
                })}
                {/* Optional: Draw lines between completed/current steps */}
                {/* <Polyline
                     positions={experience.steps.slice(0, currentStepIndex + 1).map(s => s.location)}
                     color="cyan"
                     weight={3}
                     opacity={0.7}
                     dashArray="5, 5"
                 /> */}
            </>
        );
    }

    return null; // No layer to render
}


// --- Main MapView Component ---
function MapView({
                     onMapClick,
                     isDrawerMinimized,
                     bottomNavHeight,
                     minimizedDrawerPeekHeight,
                     // NEW Props for Experience Layer
                     currentView, // To know when map interaction is active
                     selectedExperience,
                     activeQuestProgress,
                 }) {
    const position = [24.774265, 46.738586]; // Default center
    const mapRef = useRef();

    // Center map on selected experience when view changes to mapInteraction
    // This useEffect is now handled within ExperienceMapLayer

    return (
        <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            className="absolute inset-0 z-0"
            zoomControl={false}
            whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
            {MAPBOX_TOKEN ? (
                <TileLayer
                    attribution={mapboxAttribution}
                    url={mapboxTileUrl}
                    // ... other TileLayer props
                />
            ) : (
                <div style={{ background: '#333', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    Map requires configuration (Missing Token)
                </div>
            )}

            <MapEvents onMapClick={onMapClick} />

            {/* Default Marker (hide when experience is active?) */}
            {currentView !== 'mapInteraction' && (
                <Marker position={position}>
                    <Popup>Balady HQ (Example)</Popup>
                </Marker>
            )}


            {/* Render Experience Layer when in map interaction mode */}
            {currentView === 'mapInteraction' && selectedExperience && (
                <ExperienceMapLayer
                    experience={selectedExperience}
                    progress={activeQuestProgress}
                />
            )}


            {/* Render Overlays */}
            <MapOverlaysWrapper
                bottomNavHeight={bottomNavHeight}
                minimizedDrawerPeekHeight={minimizedDrawerPeekHeight}
                isDrawerMinimized={isDrawerMinimized} // Pass drawer state
            />

        </MapContainer>
    );
}

export default MapView;