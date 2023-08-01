import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import MapWithGeolocation, { Coords } from '@/components/Map/MapWithGeolocation';

const MyMapPage: React.FC = () => {
    const [coordsArray, setCoordsArray] = useState<Coords[]>([]);
    const [isTracking, setIsTracking] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedIsTracking = JSON.parse(localStorage.getItem('isTracking') || 'false');
            return storedIsTracking;
        }
        return false;
    });

    useEffect(() => {
        const storedCoords = JSON.parse(localStorage.getItem('coordsArray') || '[]');
        setCoordsArray(storedCoords);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isTracking', JSON.stringify(isTracking));
        }
    }, [isTracking]);

    const handleStartTracking = () => {
        setIsTracking(true);
        console.log('Inicio');
    };

    const handleStopTracking = () => {
        setIsTracking(false);
        console.log(coordsArray);
        console.log('Fin');
        localStorage.removeItem('coordsArray');
    };

    const renderMapComponent = (coords: Coords) => {
        return (
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={{ lat: coords.latitude, lng: coords.longitude }}
                zoom={15}
            >
                <Marker position={{ lat: coords.latitude, lng: coords.longitude }} />
            </GoogleMap>
        );
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <div>
                <h1>Map with Geolocation</h1>
                <MapWithGeolocation renderMap={renderMapComponent} onCoordsChange={setCoordsArray} active={isTracking} />
                <div>
                    <button onClick={handleStartTracking}>Start Tracking</button>
                    <button onClick={handleStopTracking}>Stop Tracking</button>
                </div>
                <div>
                    <h2>Stored Coordinates</h2>
                    <ul>
                        {coordsArray.map((coords, index) => (
                            <li key={index}>
                                Latitude: {coords.latitude}, Longitude: {coords.longitude}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </LoadScript>
    );
};

export default MyMapPage;
