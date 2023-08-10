import { GoogleMap, Marker } from '@react-google-maps/api';

interface Position {
  locationID: number;
  latitude: number | null;
  longitude: number | null;
  vehicleHasTripID: number;
  dateHour: Date;
}

interface RouteMapComponentProps {
  positions: Position[];
  selectedRoutes: Position[];
}

const RouteMapComponent: React.FC<RouteMapComponentProps> = ({ positions, selectedRoutes }) => {
  const center = positions.length > 0 ? positions[positions.length - 1] : null;

  const transformToLatLngLiteral = (position: Position): google.maps.LatLngLiteral => {
    return { lat: position.latitude || 0, lng: position.longitude || 0 };
  };

  const markerColors: { [key: number]: string } = {};

  selectedRoutes.forEach((route) => {
    markerColors[route.locationID] = 'red';
  });

  return (
    <div className="h-64 md:h-96">
      <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center ? transformToLatLngLiteral(center) : undefined} zoom={14}>
        {positions.map((position, index) => (
          <Marker
            key={index}
            position={transformToLatLngLiteral(position)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: markerColors[position.locationID] || 'blue',
              fillOpacity: 0.8,
              strokeWeight: 0,
              scale: 8,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default RouteMapComponent;
