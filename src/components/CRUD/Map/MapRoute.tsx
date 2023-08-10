import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LoadScript } from '@react-google-maps/api';

import CustomButton from '@/components/Widgets/Button/CustomButton';
import Alert from '@/components/Widgets/Alert';
import AlertVerification from '@/components/Widgets/AlertVerification';

import { ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import { toLocaleString } from '@/utils/DateUtils';
import RouteMapComponent from '@/components/Map/RouteMap';
import { filterItems, sortItems } from '@/utils/SearchFilter';
import PaginationButtons from '../PaginationButtons';
import SearchComponent from '@/components/Search/SearchComponent';

interface RouteData {
    locationID: number;
    latitude: number | null;
    longitude: number | null;
    vehicleHasTripID: number;
    dateHour: Date;
}

interface MapRouteCRUDProps {
    urls: string[];
    title: string;
    subtitle: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

const MapRouteCRUD: React.FC<MapRouteCRUDProps> = ({ urls, title, subtitle }) => {

    const [itemName] = useState<string>('Ruta');

    // -------------------------------Funciones Sobre las Rutas-------------------------------
    const router = useRouter();
    const { id, organizationID } = router.query;
    const [items, setItems] = useState<RouteData[]>([]);

    const [selectedRoutes, setSelectedRoutes] = useState<RouteData[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const fetchItems = async () => {
        try {
            const url = urls[0] || '';

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                    organizationID: organizationID,
                    vehicleHasTripID: id,
                }
                const response = await ReadRequest(url, config);
                if (!response.errors && !response.error) {
                    if (!response.message) {
                        setItems(response);
                        clearCheckbox();
                    }
                }
            }
            else {
                setMessageError("Expiro la Session")
            }

        } catch (error) {
            setMessageError(`Error seaching ${itemName}:` + (error as Error).message);
        }
    };

    const handleCheckboxChangeRoutes = (event: React.ChangeEvent<HTMLInputElement>, item: RouteData) => {
        if (event.target.checked) {
            setSelectedRoutes((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedRoutes(prevSelectedItems =>
                prevSelectedItems.filter(selectedItem => selectedItem.locationID !== item.locationID)
            );
        }
    };

    const handleMasterCheckboxChangeRoutes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(event.target.checked);
        setSelectedRoutes(event.target.checked ? items : []);
    };

    const clearCheckbox = () => {
        setSelectedRoutes([]);
        setSelectAll(false);
    }

    // -------------------------------Funciones para la Paginacion-------------------------------
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const [searchType, setSearchType] = useState<'locationID' | 'dateHour' | 'latitude' | 'longitude'>('locationID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'locationID' | 'dateHour' | 'latitude' | 'longitude'>('locationID');

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items, searchTerm, searchType);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems, sortProperty, sortDirection);

        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'locationID' | 'dateHour' | 'latitude' | 'longitude') => {
        // Si el usuario selecciona una nueva propiedad de ordenamiento, pero es diferente a la propiedad actual,
        // establecer la dirección de ordenamiento en "asc" (ascendente)
        if (property !== sortProperty) {
            setSortDirection('asc');
        }
        // Si el usuario selecciona una nueva propiedad de ordenamiento y es la misma que la propiedad actual,
        // alternar la dirección de ordenamiento entre "asc" y "desc"
        else {
            setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        }

        // Establecer la nueva propiedad de ordenamiento seleccionada
        setSortProperty(property);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        const obtenerTokenDeAcceso = async () => {
            await getSession();
            fetchItems();
        };
        obtenerTokenDeAcceso();
    }, [currentPage]);

    // -------------------------------Funciones Extra-------------------------------
    // Variables de Verificacion y error
    const [messageError, setMessageError] = useState<string | null>(null);
    const [messageVerification, setMessageVerification] = useState<string | null>(
        null
    );
    // Funcion que cierra las alarma de verificacion y errores
    const closeAlert = () => {
        setMessageError(null);
        setMessageVerification(null);
    };

    return (
        <>
            {messageError && (
                <Alert message={messageError} onClose={closeAlert} />
            )}
            {messageVerification && (
                <AlertVerification message={messageVerification} onClose={closeAlert} />
            )}

            <div className='min-h-screen mx-6 my-2'>

                <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between mb-4">
                    <div className='text-center md:text-start'>
                        <h1 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-gray-900">
                            {title}
                        </h1>
                        <p className="text-md sm:text-sm font-medium text-gray-500">
                            {subtitle}
                        </p>
                    </div>
                    <div className='flex items-center w-full md:w-52'>
                        <CustomButton type="button" onClick={fetchItems}
                            color="indigo"
                            padding_x="0"
                            padding_smx="0"
                            padding_mdx="0"
                            padding_y="2"
                            width="full"
                            height="10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            Actualizar Mapa
                        </CustomButton>
                    </div>
                </div>

                <section>
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                            <div className="flex-1 w-full md:w-1/2">
                                <RouteMapComponent positions={items} selectedRoutes={selectedRoutes} />
                            </div>
                        </LoadScript>
                    </div>
                </section>

                <div className='mt-2 sm:mt-4'>
                    <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                        <select
                            className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as
                                'locationID' | 'dateHour' | 'latitude' | 'longitude')}
                        >
                            <option value="locationID">ID de la Ruta</option>
                            <option value="latitude">Latitud</option>
                            <option value="longitude">Longitud</option>
                            <option value="dateHour">Fecha</option>
                        </select>
                    </SearchComponent>
                </div>

                <section>
                    <div className="flex flex-col items-center gap-2 md:flex-row mb-10">
                        <div className="flex w-full gap-2 flex flex-col justify-center items-center">
                            <div className="max-h-90 gap-2 w-full overflow-x-auto">
                                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">
                                    <thead className="ltr:text-left rtl:text-right">
                                        <tr>
                                            <th className="text-start px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleMasterCheckboxChangeRoutes}
                                                    checked={selectAll}
                                                />
                                            </th>
                                            <th>
                                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    <div className='flex items-center gap-1'>
                                                        ID de la Ruta
                                                        <button onClick={() => handleSortPropertyChange('locationID')}>
                                                            {sortProperty === 'locationID' ? (
                                                                sortDirection === 'asc' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>

                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    <div className='flex items-center gap-1'>
                                                        Latitud
                                                        <button onClick={() => handleSortPropertyChange('latitude')}>

                                                            {sortProperty === 'latitude' ? (
                                                                sortDirection === 'asc' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>

                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    <div className='flex items-center gap-1'>
                                                        Longitud
                                                        <button onClick={() => handleSortPropertyChange('longitude')}>

                                                            {sortProperty === 'longitude' ? (
                                                                sortDirection === 'asc' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>

                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    <div className='flex items-center gap-1'>
                                                        Fecha
                                                        <button onClick={() => handleSortPropertyChange('locationID')}>

                                                            {sortProperty === 'locationID' ? (
                                                                sortDirection === 'asc' ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                )
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>

                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {getCurrentPageItems().map(item => (
                                            <tr key={item.locationID}>
                                                <td className="px-4 py-2">
                                                    <input type="checkbox" checked={selectedRoutes.includes(item)} onChange={(event) => handleCheckboxChangeRoutes(event, item)} />
                                                </td>
                                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                                    {item.locationID}
                                                </td>
                                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                                    {item.latitude}
                                                </td>
                                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                                    {item.longitude}
                                                </td>
                                                <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                                    {toLocaleString(item.dateHour)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} />
                        </div>
                    </div>
                </section>
            </div >
        </>
    );
};

export default MapRouteCRUD;