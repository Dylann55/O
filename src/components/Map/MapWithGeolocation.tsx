import React, { useEffect, useState } from 'react';

export interface Coords {
  latitude: number;
  longitude: number;
}

interface MapWithGeolocationProps {
  renderMap: (coords: Coords) => React.ReactNode;
  onCoordsChange: (coords: Coords[]) => void;
  active: boolean;
}

const MapWithGeolocation: React.FC<MapWithGeolocationProps> = ({ renderMap, active, onCoordsChange }) => {
  const [currentPosition, setCurrentPosition] = useState<Coords | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Función para obtener la posición actual
    const getCurrentPosition = () => {
      if (active && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords: Coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCurrentPosition(coords);
            saveToLocalStorage(coords);
          },
          (error) => {
            console.error('Error obtaining geolocation:', error);
          }
        );
      }
    };

    // Función para guardar las coordenadas en el localStorage
    const saveToLocalStorage = (coords: Coords) => {
      const storedCoords = JSON.parse(localStorage.getItem('coordsArray') || '[]');
      storedCoords.push(coords);
      localStorage.setItem('coordsArray', JSON.stringify(storedCoords));
      onCoordsChange(storedCoords);
    };

    // Ejecutar la función para obtener la posición actual inmediatamente
    getCurrentPosition();

    // Configurar el intervalo para ejecutar la función cada 5 minutos (300,000 ms) si está activo
    if (active) {
      intervalId = setInterval(getCurrentPosition, 300000);
    }

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      clearInterval(intervalId);
    };
  }, [active, onCoordsChange]);

  return <>{currentPosition && renderMap(currentPosition)}</>;
};

export default MapWithGeolocation;
