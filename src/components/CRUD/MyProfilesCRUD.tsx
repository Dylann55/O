import React, { useState, useEffect } from 'react';

import { BsPersonFill } from 'react-icons/bs';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';

import { ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';

interface Item {
    userHasProfile: number;
    userID: string;
    profileID: number;
    roles: string;
    name: string;
    lastname: string;
    email: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina
const url_item = process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage';

const MyProfilesCRUD: React.FC = () => {

    const [itemName] = useState<string>('Usuario');

    const [items, setItems] = useState<Item[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // -------------------------------Funciones Para el CRUD-------------------------------

    const fetchItems = async () => {
        try {
            const url = url_item + `/listMyParticipation`;

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                }

                const response = await ReadRequest(url, config);
                console.log(response);
                if (!response.error) {
                    if (response.message) {
                        setMessageError(response.message);
                    }
                    setItems(response);
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
    const getCurrentPageItems = () => {
        if (!Array.isArray(items)) {
            return [];
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        return items.slice(startIndex, endIndex);
    };

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

            <div className=' bg-gray-100 min-h-screen pt-3 mx-2'>

                <div className="mx-2 sm:mx-4 overflow-x-auto">

                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">

                        <thead className="ltr:text-left rtl:text-right">
                            <tr>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    ID de la {itemName}
                                </th>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Nombre Completo
                                </th>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Email
                                </th>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Roles
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {getCurrentPageItems().map(item => (

                                <tr key={item.userID}>

                                    <td className="text-gray-600 whitespace-nowrap px-4 py-2 font-medium">
                                        {item.userID}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        <div className='flex items-center'>
                                            <div className='bg-indigo-100 p-3 rounded-lg'>
                                                <BsPersonFill className='text-indigo-500' />
                                            </div>
                                            <p className='text-gray-600 pl-4'>{item.name + ' ' + item.lastname}</p>
                                        </div>
                                    </td>

                                    <td className="text-gray-600 whitespace-nowrap px-4 py-2 font-medium">
                                        {item.email}
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
