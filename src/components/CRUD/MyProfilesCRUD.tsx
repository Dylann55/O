import React, { useState, useEffect } from 'react';

import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';

import { ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import Link from 'next/link';
import CustomButton from '../Widgets/Button/CustomButton';

interface Item {
    userHasProfile: number;
    userID: string;
    profileID: number;
    roles: string;
    organizationname: string;
    organizationID: number;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

interface MyProfilesCRUDProps {
    urls: string[];
    title: string;
    subtitle: string;
    role: boolean;
}

const MyProfilesCRUD: React.FC<MyProfilesCRUDProps> = ({ urls, title, subtitle, role }) => {

    const [itemName] = useState<string>('Usuario');

    const [items, setItems] = useState<Item[]>([]);

    const [isChofer] = useState<boolean>(role);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // -------------------------------Funciones Para el CRUD-------------------------------

    const fetchItems = async () => {
        try {
            const url = urls[0] || '';

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                }

                const response = await ReadRequest(url, config);
                if (!response.error) {
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
    const [searchType, setSearchType] = useState<'organizationID' | 'organizationname'>('organizationID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'organizationID' | 'organizationname'>('organizationID');

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems);

        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'organizationID' | 'organizationname') => {
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
    const filterItems = (items: Item[]) => {
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

            return false;
        });
    }

    // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
    const sortItems = (items: Item[]) => {
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

    // -------------------------------Funciones de Extra-------------------------------

    //Funcion que se encarga de separar roles en rol individuales
    const getFormattedRoles = (roles: string) => {
        return roles.split(',').map(role => role.trim());
    };

    useEffect(() => {

        const obtenerTokenDeAcceso = async () => {
            await getSession();
            fetchItems();
        };

        obtenerTokenDeAcceso();

    }, [currentPage]);

    // Variables de Verificacion y error
    const [messageError, setMessageError] = useState<string | null>(null);
    const [messageVerification, setMessageVerification] = useState<string | null>(
        null
    );

    // -------------------------------Funciones Extra-------------------------------
    // Funcion que cierra las alarma de verificacion y errores
    const closeAlert = () => {
        setMessageError(null);
        setMessageVerification(null);
    };

    return (
        <div>

            <div className="space-y-4">

                {messageError && (
                    <>
                        <Alert message={messageError} onClose={closeAlert} />
                    </>
                )}

                {messageVerification && (
                    <>
                        <AlertVerification message={messageVerification} onClose={closeAlert} />
                    </>
                )}

            </div>

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

                </div>

                <div className='flex flex-col items-center gap-2 sm:flex-row'>

                    <div className='flex-1 w-full sm:w-auto'>
                        <div className="relative z-1">
                            <label htmlFor="Search" className="sr-only">
                                Search
                            </label>

                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border-gray-200 py-2.5 pl-10 pr-3 shadow-sm sm:text-sm"
                            />

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-4 w-4 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                />
                            </svg>
                        </div>
                    </div>


                    <div className='flex-2 w-full sm:w-auto'>
                        <select
                            className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as
                                'organizationID' | 'organizationname'
                            )}
                        >
                            <option value="organizationID">ID de la Organizacion</option>
                            <option value="organizationname">Nombre de la Organizacion</option>
                        </select>
                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">

                        <thead>
                            <tr>

                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <div className='flex items-center justify-center gap-1'>
                                        ID de la Organizacion
                                        <button onClick={() => handleSortPropertyChange('organizationID')}>

                                            {sortProperty === 'organizationID' ? (
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
                                </th>

                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <div className='flex items-center justify-center gap-1'>
                                        Nombre de la Organizacion
                                        <button onClick={() => handleSortPropertyChange('organizationname')}>

                                            {sortProperty === 'organizationname' ? (
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
                                </th>

                                <th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Roles
                                </th>


                                {isChofer && (
                                    <th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Roles
                                    </th>
                                )}

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 text-center">
                            {getCurrentPageItems().map(item => (

                                <tr key={item.organizationID}>


                                    <td className="text-gray-600 whitespace-nowrap px-4 py-2 font-medium">
                                        {item.organizationID
                                        }
                                    </td>

                                    <td className="text-gray-600 whitespace-nowrap px-4 py-2 font-medium">
                                        {item.organizationname}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {getFormattedRoles(item.roles).map((role, index) => (
                                            <span
                                                key={index}
                                                className={`mr-1 px-2.5 py-0.5 rounded 
                                                ${role === 'Jefe'
                                                        ? 'bg-blue-200 text-blue-800'
                                                        : role === 'Chofer'
                                                            ? 'bg-green-200 text-green-800'
                                                            : role === 'Proveedor'
                                                                ? 'bg-yellow-200 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                    }`
                                                }
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </td>

                                    {isChofer && (
                                        <th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            <Link href={`/Transport/Routes/${item.organizationID}?name=${encodeURIComponent(item.organizationname)}`}>
                                                <CustomButton
                                                    type="button"
                                                    color="indigo"
                                                    padding_x="4"
                                                    padding_smx="4"
                                                    padding_mdx="4"
                                                    padding_y="2"
                                                    width="32"
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
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                                                        />
                                                    </svg>

                                                    Ver Rutas
                                                </CustomButton>
                                            </Link>
                                        </th>
                                    )}

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

                {/* Pagination controls */}
                <div className="flex item-center justify-center gap-1 mt-2">

                    <button onClick={handlePrevPage}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                        disabled={currentPage === 1}
                    >
                        <span className="sr-only">Prev Page</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    <div>
                        <span className="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900">
                            {currentPage}
                        </span>
                    </div>

                    <button onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                    >
                        <span className="sr-only">Next Page</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                </div>

            </div>

        </div>
    );
};

export default MyProfilesCRUD;
