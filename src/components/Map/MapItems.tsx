import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import React from 'react';

interface RouteData {
    name: string;
    description: string;
    name1: string;
    latitude1: number | null;
    longitude1: number | null;
    name2: string;
    latitude2: number | null;
    longitude2: number | null;
}

interface MapItemsProps {
    items: RouteData[];
    selectedRoutes: number[]; // Add the selectedRoutes prop
}

const MapItems: React.FC<MapItemsProps> = ({ items, selectedRoutes }) => {
    // You can set the center of the map using the first item's location, or any other logic you prefer
    const center = {
        lat: items[0]?.latitude1 || 0,
        lng: items[0]?.longitude1 || 0,
    };

    const filteredItems = items.filter((_, index) => selectedRoutes.includes(index));

    return (
        <div style={{ width: '500px', height: '400px', border: '1px solid black' }}>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap mapContainerStyle={{ width: '500px', height: '400px' }} center={center} zoom={2}>
                    {filteredItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <Marker
                                position={{
                                    lat: item.latitude1 || 0,
                                    lng: item.longitude1 || 0,
                                }}
                                title={item.name1}
                                icon={{
                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                    scaledSize: new window.google.maps.Size(30, 30),
                                }}
                            />

                                

                            <Marker
                                position={{
                                    lat: item.latitude2 || 0,
                                    lng: item.longitude2 || 0,
                                }}
                                title={item.name2}
                                icon={{
                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                    scaledSize: new window.google.maps.Size(30, 30),
                                }}
                            />
                        </React.Fragment>
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default MapItems;