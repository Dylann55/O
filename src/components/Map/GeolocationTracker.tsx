import { useEffect, useState, useRef } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  dateHour: Date;
  vehicleHasTripID: number;
}

interface Props {
  positions: Position[];
  setPositions: (positions: Position[]) => void;
}

const GeolocationTracker: React.FC<Props> = ({ positions, setPositions }) => {
  const [positionHistory, setPositionHistory] = useState<Position[]>(positions);
  const positionHistoryRef = useRef<Position[]>(positionHistory);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (currentPosition) => {
          const { latitude, longitude } = currentPosition.coords;
          const vehicleHasTripIDFromStorage = localStorage.getItem("vehicleHasTripID");
          const parsedVehicleHasTripID = vehicleHasTripIDFromStorage ? parseInt(vehicleHasTripIDFromStorage) : 0;
          const newPosition: Position = { latitude, longitude, dateHour: new Date(), vehicleHasTripID: parsedVehicleHasTripID, };
          // Update the position history with the new position
          setPositionHistory((prevPositions) => {
            const updatedPositions = [...prevPositions, newPosition];
            positionHistoryRef.current = updatedPositions;
            return updatedPositions;
          });

          // Update the positions directly using setPositions
          setPositions(positionHistoryRef.current);

          // Save to localStorage (optional)
          saveToLocalStorage(positionHistoryRef.current);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    };

    const saveToLocalStorage = (data: Position[]) => {
      try {
        localStorage.setItem('positions', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    };

    const startTracking = () => {
      // Get the first position immediately when starting tracking
      getPosition();

      // Schedule getPosition to be called every 5 minutes (300,000 milliseconds)
      intervalId = setInterval(getPosition, 3 * 60 * 1000);
    };

    const stopTracking = () => {
      // Clear the interval when stopping tracking
      clearInterval(intervalId);
    };

    startTracking();

    return () => {
      stopTracking();
    };
  }, [setPositions]);

  return (
    <>
    </>
  );
};

export default GeolocationTracker;

