import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapOverlaysWrapper from './MapOverlays'; // Import the overlay wrapper

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


function MapView({ onMapClick, isDrawerMinimized, bottomNavHeight, minimizedDrawerPeekHeight }) { // Pass necessary props for overlays
    const position = [24.774265, 46.738586];
    const mapRef = useRef();

    return (
        // MapContainer provides the context for useMap()
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
                    tileSize={512}
                    zoomOffset={-1}
                    maxZoom={22}
                />
            ) : (
                <div style={{ background: '#333', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    Map requires configuration (Missing Token)
                </div>
            )}

            {/* Event handler for clicks directly on the map */}
            <MapEvents onMapClick={onMapClick} />

            {/* Example Marker */}
            <Marker position={position}>
                <Popup>Riyadh Example Location. <br /> Mapbox Dark Style.</Popup>
            </Marker>

            {/* Render Overlays INSIDE MapContainer so they get context */}
            {/* Pass down the props needed by MapOverlays */}
            <MapOverlaysWrapper
                bottomNavHeight={bottomNavHeight}
                minimizedDrawerPeekHeight={minimizedDrawerPeekHeight}
                isDrawerMinimized={isDrawerMinimized}
            />

            {/* Add more Leaflet layers here */}

        </MapContainer>
    );
}

export default MapView;