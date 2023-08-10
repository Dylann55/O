import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Alert from '@/components/Widgets/Alert';
import AlertVerification from '@/components/Widgets/AlertVerification';

import { ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import { toLocaleString } from '@/utils/DateUtils';
import CustomButton from '@/components/Widgets/Button/CustomButton';
import Link from 'next/link';
import PaginationButtons from '../PaginationButtons';
import SearchComponent from '@/components/Search/SearchComponent';

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

interface MyRoutesCRUDProps {
    urls: string[];
    title: string;
    subtitle: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

const MyRoutesCRUD: React.FC<MyRoutesCRUDProps> = ({ urls, title, subtitle }) => {

    const [itemName] = useState<string>('Ruta');

    // -------------------------------Funciones Sobre las Rutas-------------------------------
    const router = useRouter();

    const { id } = router.query;
    // Si id es un string[] (array), seleccionamos el primer elemento como id
    const selectedId = Array.isArray(id) ? id[0] : id;
    // Validar que selectedId no sea undefined y proporcionar un valor predeterminado (puedes usar una cadena vacía o algún otro valor)
    const organizationID = selectedId !== undefined ? selectedId : '';

    const [items, setItems] = useState<RouteData[]>([]);

    const fetchItems = async () => {
        try {
            const url = urls[0] || '';

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                    organizationID: id
                }
                const response = await ReadRequest(url, config);
                if (!response.errors && !response.error) {
                    if (!response.message) {
                        setItems(response);
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

    // -------------------------------Funciones para la Paginacion-------------------------------
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const [searchType, setSearchType] = useState<'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden'>('id');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden'>('id');

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        //'vehicleID' | 'patent' | 'mark' | 'model' | 'maxWeight'

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems);


        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden') => {
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

    // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
    const filterItems = (items: RouteData[]) => {
        if (!items) {
            return [];
        }

        return items.filter((item) => {
            const propValue = item[searchType];

            if (propValue !== undefined && typeof propValue === 'string') {
                return propValue.toLowerCase().includes(searchTerm.toLowerCase());
            }

            if (propValue !== undefined && typeof propValue === 'number') {
                return propValue.toString().includes(searchTerm);
            }

            if (propValue instanceof Date) {
                const searchTermDate = new Date(searchTerm);

                // Comparar las fechas ignorando las horas, minutos, segundos y milisegundos
                return (
                    propValue.getFullYear() === searchTermDate.getFullYear() &&
                    propValue.getMonth() === searchTermDate.getMonth() &&
                    propValue.getDate() === searchTermDate.getDate()
                );
            }

            return false;
        });
    }

    // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
    const sortItems = (items: RouteData[]) => {
        return items.sort((a, b) => {
            const propA = a[sortProperty];
            const propB = b[sortProperty];

            if (propA !== undefined && propB !== undefined) {
                if (typeof propA === 'string' && typeof propB === 'string') {
                    return sortDirection === 'asc' ? propA.localeCompare(propB) : propB.localeCompare(propA);
                }

                if (typeof propA === 'number' && typeof propB === 'number') {
                    return sortDirection === 'asc' ? propA - propB : propB - propA;
                }

                if (propA instanceof Date && propB instanceof Date) {
                    return sortDirection === 'asc' ? propA.getTime() - propB.getTime() : propB.getTime() - propA.getTime();
                }
            }

            return 0;
        });
    }

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
                    <div className="flex items-center w-full md:w-36">
                        <CustomButton onClick={fetchItems} type="button"
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
                            Actualizar
                        </CustomButton>
                    </div>
                </div>

                <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                    <select
                        className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as
                            'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' |
                            'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' |
                            'typeBurden')}
                    >
                        <option value="id">ID de la Ruta</option>
                        <option value="Name">Nombre de la Ruta</option>
                        <option value="UbicationI">Nombre de Inicio</option>
                        <option value="UbicationF">Nombre de Fin</option>
                        <option value="dateAssignment">Fecha de Inicio</option>
                        <option value="dateAssignmentF">Fecha de Finalizacion</option>
                        <option value="status">Estado</option>
                        <option value="userID">ID del Perfil del Chofer</option>
                        <option value="userHasprofileID">ID del Chofer</option>
                        <option value="vehicleID">ID del Vehiculo</option>
                        <option value="mark">Marca del Vehiculo</option>
                        <option value="patent">Patente del Vehiculo</option>
                        <option value="model">Modelo del Vehiculo</option>
                        <option value="weight">Maximo Peso del Vehiculo</option>
                        <option value="typeBurdenID">ID de la Carga</option>
                        <option value="typeBurden">Nombre de la Carga</option>
                        <option value="weight">Peso de la Carga</option>
                    </select>
                </SearchComponent>

                <div className="flex w-full gap-2 flex flex-col justify-center items-center">
                    <div className="max-h-90 gap-2 w-full overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">
                            <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                    <th>
                                        <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            <div className='flex items-center gap-1'>
                                                ID de la Ruta
                                                <button onClick={() => handleSortPropertyChange('id')}>
                                                    {sortProperty === 'id' ? (
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
                                                Nombre de la Ruta
                                                <button onClick={() => handleSortPropertyChange('Name')}>

                                                    {sortProperty === 'Name' ? (
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
                                                Nombre de Inicio
                                                <button onClick={() => handleSortPropertyChange('UbicationI')}>

                                                    {sortProperty === 'UbicationI' ? (
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
                                                Nombre de Fin
                                                <button onClick={() => handleSortPropertyChange('UbicationF')}>

                                                    {sortProperty === 'UbicationF' ? (
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
                                                Fecha de Inicio
                                                <button onClick={() => handleSortPropertyChange('dateAssignment')}>

                                                    {sortProperty === 'dateAssignment' ? (
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
                                                Fecha de Finalizacion
                                                <button onClick={() => handleSortPropertyChange('dateAssignmentF')}>

                                                    {sortProperty === 'dateAssignmentF' ? (
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
                                                Estado
                                                <button onClick={() => handleSortPropertyChange('status')}>

                                                    {sortProperty === 'status' ? (
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
                                                ID del Perfil del Chofer
                                                <button onClick={() => handleSortPropertyChange('userID')}>

                                                    {sortProperty === 'userID' ? (
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
                                                ID del Chofer
                                                <button onClick={() => handleSortPropertyChange('userHasprofileID')}>

                                                    {sortProperty === 'userHasprofileID' ? (
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
                                                ID del Vehiculo
                                                <button onClick={() => handleSortPropertyChange('vehicleID')}>

                                                    {sortProperty === 'vehicleID' ? (
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
                                                Marca del Vehiculo
                                                <button onClick={() => handleSortPropertyChange('mark')}>

                                                    {sortProperty === 'mark' ? (
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
                                                Patente del Vehiculo
                                                <button onClick={() => handleSortPropertyChange('patent')}>

                                                    {sortProperty === 'model' ? (
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
                                                Modelo del Vehiculo
                                                <button onClick={() => handleSortPropertyChange('model')}>

                                                    {sortProperty === 'model' ? (
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
                                                Maximo Peso del Vehiculo
                                                <button onClick={() => handleSortPropertyChange('weight')}>

                                                    {sortProperty === 'weight' ? (
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
                                                ID de la Carga
                                                <button onClick={() => handleSortPropertyChange('typeBurdenID')}>

                                                    {sortProperty === 'typeBurdenID' ? (
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
                                                Nombre de la Carga
                                                <button onClick={() => handleSortPropertyChange('typeBurden')}>

                                                    {sortProperty === 'typeBurden' ? (
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
                                                Peso de la Carga
                                                <button onClick={() => handleSortPropertyChange('weight')}>

                                                    {sortProperty === 'weight' ? (
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
                                    <th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {getCurrentPageItems().map(item => (
                                    <tr key={item.id}>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.id}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.Name}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.UbicationI}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.UbicationF}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {toLocaleString(item.dateAssignment)}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {toLocaleString(item.dateAssignmentF)}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.status}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.userID}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.userHasprofileID}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.vehicleID}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.mark}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.patent}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.model}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.weight}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.typeBurdenID}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.typeBurden}
                                        </td>
                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                            {item.weight}
                                        </td>
                                        <td className="flex justify-center items-center space-x-4 px-4 py-2">
                                            {item.status === "Pendiente" && (
                                                <>
                                                    <Link href={`/${urls[1]}/Route/${item.vehicleHasTripID}?name=${encodeURIComponent(
                                                        item.Name
                                                    )}&organizationID=${encodeURIComponent(organizationID)}`}>
                                                        <CustomButton type="button"
                                                            color="indigo"
                                                            padding_x="0"
                                                            padding_smx="0"
                                                            padding_mdx="0"
                                                            padding_y="2"
                                                            width="36"
                                                            height="10"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="h-4 w-4"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                                                            </svg>
                                                            Iniciar
                                                        </CustomButton>
                                                    </Link>
                                                    <Link href={`/${urls[1]}/Recharge/${item.vehicleHasTripID}?name=${encodeURIComponent(item.Name)}&organizationID=${encodeURIComponent(organizationID)}`}>
                                                        <CustomButton type="button"
                                                            color="indigo"
                                                            padding_x="4"
                                                            padding_smx="4"
                                                            padding_mdx="4"
                                                            padding_y="2"
                                                            width="36"
                                                            height="10"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="h-4 w-4"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />

                                                            </svg>
                                                            Recargas
                                                        </CustomButton>
                                                    </Link>
                                                </>
                                            )}

                                            {item.status === "En proceso" && (
                                                <>
                                                    <Link href={`/${urls[1]}/Route/${item.vehicleHasTripID}?name=${encodeURIComponent(
                                                        item.Name
                                                    )}&organizationID=${encodeURIComponent(organizationID)}`}>
                                                        <CustomButton type="button"
                                                            color="yellow"
                                                            padding_x="0"
                                                            padding_smx="0"
                                                            padding_mdx="0"
                                                            padding_y="2"
                                                            width="36"
                                                            height="10"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="h-4 w-4"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                                                            </svg>
                                                            {item.status}
                                                        </CustomButton>
                                                    </Link>
                                                    <Link href={`/${urls[1]}/Recharge/${item.vehicleHasTripID}?name=${encodeURIComponent(item.Name)}&organizationID=${encodeURIComponent(organizationID)}`}>
                                                        <CustomButton type="button"
                                                            color="yellow"
                                                            padding_x="4"
                                                            padding_smx="4"
                                                            padding_mdx="4"
                                                            padding_y="2"
                                                            width="36"
                                                            height="10"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="h-4 w-4"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />

                                                            </svg>
                                                            Recargas
                                                        </CustomButton>
                                                    </Link>
                                                </>
                                            )}
                                            {item.status === "Finalizado" && (
                                                <>
                                                    <CustomButton type="button"
                                                        color="red"
                                                        padding_x="0"
                                                        padding_smx="0"
                                                        padding_mdx="0"
                                                        padding_y="2"
                                                        width="36"
                                                        height="10"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="h-4 w-4"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                                                        </svg>
                                                        {item.status}
                                                    </CustomButton>
                                                    <CustomButton type="button"
                                                        color="red"
                                                        padding_x="0"
                                                        padding_smx="0"
                                                        padding_mdx="0"
                                                        padding_y="2"
                                                        width="36"
                                                        height="10"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="h-4 w-4"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                                                        </svg>
                                                        Recargas
                                                    </CustomButton>
                                                </>
                                            )}

                                            <Link href={`/${urls[1]}/Map/${item.vehicleHasTripID}?name=${encodeURIComponent(item.Name)}&organizationID=${encodeURIComponent(organizationID)}`}>
                                                <CustomButton type="button"
                                                    color="indigo"
                                                    padding_x="4"
                                                    padding_smx="4"
                                                    padding_mdx="4"
                                                    padding_y="2"
                                                    width="36"
                                                    height="10"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="h-4 w-4"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                                                    </svg>
                                                    Ver Ruta
                                                </CustomButton>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} />
                </div>
            </div >
        </>
    );
};

export default MyRoutesCRUD;