import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MarkerData {
  name: string;
  latitude: number | null;
  longitude: number | null;
}

interface CustomMapProps {
  markers: MarkerData[];
  selectedMarkers: number[];
  center: { lat: number; lng: number };
  handleMapClick: (e: google.maps.MapMouseEvent) => void;
}

const CustomMap: React.FC<CustomMapProps> = ({
  markers,
  selectedMarkers,
  center,
  handleMapClick,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div style={{ width: '500px', height: '400px', border: '1px solid black' }}>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={{ width: '500px', height: '400px' }}
          center={center}
          zoom={2}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
        >
          {mapLoaded &&
            markers.map((item, index) => (
              <Marker
                key={index}
                position={{ lat: item.latitude!, lng: item.longitude! }}
                title={item.name}
                icon={{
                  url: selectedMarkers.includes(index)
                    ? 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default CustomMap;
