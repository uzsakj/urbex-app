import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationPickerProps {
    coordinates: { lat: number; lng: number } | null;
    setCoordinates: (coords: { lat: number; lng: number }) => void;
}

const LocationMarker = ({ setCoordinates }: { setCoordinates: (coords: { lat: number; lng: number }) => void }) => {
    useMapEvents({
        click(e) {
            setCoordinates(e.latlng);
        },
    });
    return null;
};

const MapCenterUpdater = ({ center }: { center: { lat: number; lng: number } }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);

    return null;
};

const LocationPicker = ({ coordinates, setCoordinates }: LocationPickerProps) => {
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 47.4979, lng: 19.0402 });

    const handleUseCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setCenter(coords);
                setCoordinates(coords);
            },
            (err) => {
                console.error(err);
                alert('Could not fetch your location.');
            }
        );
    };

    useEffect(() => {
        if (coordinates) setCenter(coordinates);
    }, [coordinates]);

    return (
        <Box sx={{ mt: 3 }}>
            <Box sx={{ textAlign: 'center' }}>

                <Button onClick={handleUseCurrentLocation} variant="outlined" size="small" sx={{ mb: 1 }}>
                    Use Current Location
                </Button>
            </Box>

            <Box sx={{ height: 300, border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {coordinates && <Marker position={coordinates} icon={markerIcon} />}
                    <LocationMarker setCoordinates={setCoordinates} />
                    <MapCenterUpdater center={center} />
                </MapContainer>
            </Box>
        </Box>
    );
};

export default LocationPicker;
