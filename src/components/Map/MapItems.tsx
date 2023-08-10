import { GoogleMap, Marker } from '@react-google-maps/api';
import React from 'react';

interface RouteData {
    id: number;
    Name: string;
    UbicationI: string;
    latitude1: number | null;
    longitude1: number | null;
    UbicationF: string;
    latitude2: number | null;
    longitude2: number | null;

    vehicleHasTripID: number;
    vehicleID: number;
    tripID: number;
    userHasprofileID: number;
    dateAssignment: Date;
    typeBurdenID: number;
    status: string;
    dateAssignmentF: Date;

    userID: number;
    profileID: number;
    weight: number;
    typeBurden: string;
    patent: string;
    mark: string;
    model: string;
}

interface MapItemsProps {
    items: RouteData[];
    selectedRoutes: RouteData[]; // Add the selectedRoutes prop
}

const MapItems: React.FC<MapItemsProps> = ({ items, selectedRoutes }) => {
    // You can set the center of the map using the first item's location, or any other logic you prefer
    const center = {
        lat: items[0]?.latitude1 || 0,
        lng: items[0]?.longitude1 || 0,
    };
    const filteredItems = items.filter((item) => selectedRoutes.some((selectedItem) => selectedItem.id === item.id));

    return (

        <div className="h-64 md:h-96">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center} zoom={2}>
                {filteredItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <Marker
                            position={{
                                lat: item.latitude1 || 0,
                                lng: item.longitude1 || 0,
                            }}
                            title={item.UbicationI}
                            icon={{
                                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                scaledSize: new window.google.maps.Size(30, 30),
                            }}
                        />



                        <Marker
                            position={{
                                lat: item.latitude2 || 0,
                                lng: item.longitude2 || 0,
                            }}
                            title={item.UbicationF}
                            icon={{
                                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                                scaledSize: new window.google.maps.Size(30, 30),
                            }}
                        />
                    </React.Fragment>
                ))}
            </GoogleMap>
        </div>
    );
};

export default MapItems;