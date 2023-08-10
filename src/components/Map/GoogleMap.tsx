import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Position {
    latitude: number;
    longitude: number;
}

interface GoogleMapComponentProps {
    positions: Position[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ positions }) => {
    const mapStyles = {
        height: '400px',
        width: '100%',
    };

    const center = positions.length > 0 ? positions[positions.length - 1] : null;

    const transformToLatLngLiteral = (position: Position): google.maps.LatLngLiteral => {
        return { lat: position.latitude, lng: position.longitude };
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <div className="flex-1 w-full md:w-1/2">
                <GoogleMap mapContainerStyle={mapStyles} center={center ? transformToLatLngLiteral(center) : undefined} zoom={14}>
                    {positions.map((position, index) => (
                        <Marker key={index} position={transformToLatLngLiteral(position)} />
                    ))}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default GoogleMapComponent;
