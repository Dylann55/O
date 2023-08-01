import { useState } from 'react';
import MapItems from '@/components/Map/MapItems';
import CustomMap from '@/components/Map/CustomMap';

interface MarkerData {
    name: string;
    latitude: number | null;
    longitude: number | null;
}

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

const MapCRUD: React.FC = () => {

    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [selectedMarkers, setSelectedMarkers] = useState<number[]>([]);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

    const handleMapClick = async (e: google.maps.MapMouseEvent) => {
        const { latLng } = e;
        if (latLng) {
            const lat = latLng.lat();
            const lng = latLng.lng();

            try {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                );

                if (!response.ok) {
                    throw new Error('Error al obtener información del lugar');
                }

                const marker = await response.json();
                console.log(marker);
                const placeName = marker.results[0]?.formatted_address || `Marcador ${markers.length + 1}`;

                const newMarker: MarkerData = {
                    name: placeName,
                    latitude: lat,
                    longitude: lng,
                };
                setMarkers((prevData) => [...prevData, newMarker]);
                setCenter({ lat, lng }); // Centrar el mapa en el nuevo marcador
            } catch (error) {
                console.error('Error al obtener información del lugar:', error);
            }
        }
    };

    const handleDelete = () => {
        const newData = markers.filter((_, index) => !selectedMarkers.includes(index));
        setMarkers(newData);
        setSelectedMarkers([]);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedMarkers((prevSelected) => [...prevSelected, index]);
        } else {
            setSelectedMarkers((prevSelected) => prevSelected.filter((item) => item !== index));
        }
    };

    const handleMasterCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (checked) {
            const allIndexes = markers.map((_, index) => index);
            setSelectedMarkers(allIndexes);
        } else {
            setSelectedMarkers([]);
        }
    };

    const [selectedMarker1, setSelectedMarker1] = useState<number>(-1);
    const [selectedMarker2, setSelectedMarker2] = useState<number>(-1);
    const [Items, setItems] = useState<RouteData[]>([]);
    const [newItem, setNewItem] = useState<RouteData>({
        name: '',
        description: '',

        name1: '',
        latitude1: 0,
        longitude1: 0,
        name2: '',
        latitude2: 0,
        longitude2: 0,
    });

    const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);

    const handleSubmit = () => {
        // Verificar si se han realizado selecciones válidas
        if ((selectedMarker1 === null || selectedMarker2 === null) || (selectedMarker1 === selectedMarker2)) {
            console.log('Debe seleccionar dos marcadores válidos.');
            return;
        }

        // Get the markers of the selected markers using the index as the key
        const marker1Data = markers[selectedMarker1];
        const marker2Data = markers[selectedMarker2];

        // Check if marker1Data and marker2Data are defined before proceeding
        if (!marker1Data || !marker2Data) {
            console.log('Los datos de los marcadores seleccionados no son válidos.');
            return;
        }

        // Crea una nueva objeto RouteData con el formulario y las marcas selecionadas
        const newRoute: RouteData = {
            name: newItem.name,
            description: '',
            name1: marker1Data.name,
            latitude1: marker1Data.latitude,
            longitude1: marker1Data.longitude,
            name2: marker2Data.name,
            latitude2: marker2Data.latitude,
            longitude2: marker2Data.longitude,
        };

        setItems((prevData) => [...prevData, newRoute]);
        // Print the markers
        console.log('Route Data:', Items);
    };

    const handleCheckboxChangeRoutes = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedRoutes((prevSelected) => [...prevSelected, index]);
        } else {
            setSelectedRoutes((prevSelected) => prevSelected.filter((item) => item !== index));
        }
    };

    const handleMasterCheckboxChangeRoutes = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (checked) {
            const allIndexes = Items.map((_, index) => index);
            setSelectedRoutes(allIndexes);
        } else {
            setSelectedRoutes([]);
        }
    };

    const handleDeleteSelectedRoutes = () => {
        const newData = Items.filter((_, index) => !selectedRoutes.includes(index));
        setItems(newData);
        setSelectedRoutes([]);
    };


    return (
        <div>
            <div className='flex'>
                <div className='flex-1'>

                    <CustomMap
                        markers={markers}
                        selectedMarkers={selectedMarkers}
                        center={center}
                        handleMapClick={handleMapClick}
                    />

                    <button onClick={handleDelete}>Eliminar seleccionados</button>
                </div>

                <div className='flex-1 ml-4 mt-4'>

                    <form>
                        <div>
                            <label htmlFor="name">Nombre:</label>
                            <input
                                type="text"
                                id="name"
                                value={newItem.name || ''}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="marker1">Marcador 1:</label>
                            <select
                                id="marker1"
                                value={selectedMarker1}
                                onChange={(e) => setSelectedMarker1(Number(e.target.value))}
                            >
                                <option value="-1">Seleccione un marcador</option>
                                {markers.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="marker2">Marcador 2:</label>
                            <select
                                id="marker2"
                                value={selectedMarker2}
                                onChange={(e) => setSelectedMarker2(Number(e.target.value))}
                            >
                                <option value="-1">Seleccione un marcador</option>
                                {markers.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="button" onClick={handleSubmit}>
                            Imprimir datos
                        </button>
                    </form>

                </div>
            </div>

            <div className='mx-2 sm:mx-4 overflow-x-auto'>
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="text-start px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedMarkers.length === markers.length}
                                    onChange={handleMasterCheckboxChange}
                                />
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Nombre
                                </div>
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Latitud
                                </div>
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Longitud
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {markers.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedMarkers.includes(index)}
                                        onChange={(e) => handleCheckboxChange(e, index)}
                                    />
                                </td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">{item.name}</td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">{item.latitude}</td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">{item.longitude}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <MapItems items={Items} selectedRoutes={selectedRoutes} />

            <button onClick={handleDeleteSelectedRoutes}>Eliminar rutas seleccionadas</button>

            <div className='mx-2 sm:mx-4 overflow-x-auto'>
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="text-start px-4 py-2">
                                <input
                                    type="checkbox"
                                    onChange={handleMasterCheckboxChangeRoutes}
                                    checked={selectedRoutes.length === Items.length}
                                />
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Nombre de la Ruta
                                </div>
                            </th>

                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Nombre
                                </div>
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Latitud
                                </div>
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Longitud
                                </div>
                            </th>

                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Nombre
                                </div>
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Latitud
                                </div>
                            </th>
                            <th>
                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Longitud
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoutes.includes(index)}
                                        onChange={(e) => handleCheckboxChangeRoutes(e, index)}
                                    />

                                </td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.name}
                                </td>

                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.name1}
                                </td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.latitude1}
                                </td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.longitude1}
                                </td>

                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.name2}
                                </td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.latitude2}
                                </td>
                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                    {item.longitude2}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MapCRUD;
