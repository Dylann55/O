import React, { useState, useEffect } from 'react';

import { BsPersonFill } from 'react-icons/bs';
import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';

import { CreateRequest, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import { isPasswordValid } from '@/utils/VerifyUser';

interface Item {
    id: number;
    name: string;
    email: string;
    lastName: string;
    password: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina
const url_item = process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin';

const UsersAdminCRUD: React.FC = () => {

    const [itemName] = useState<string>('Usuario');

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Item>({
        id: 0,
        name: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [updateId, setUpdateId] = useState<number | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // -------------------------------Funciones Para el CRUD-------------------------------

    const fetchItems = async () => {
        try {
            const url = url_item + `/users`;

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                }

                const response = await ReadRequest(url, config);
                if (!response.error) {
                    if (response.message) {
                        setMessageError(response.message);
                    }
                    setItems(response);
                    clearCheckbox();
                }
            }
            else {
                setMessageError("Expiro la Session")
            }

        } catch (error) {
            setMessageError(`Error seaching ${itemName}:` + (error as Error).message);
        }
    };

    const handleCreate = async () => {
        try {
            if (!isPasswordValid(newItem.password)) {
                setMessageError('Contraseña Invalida');
                return;
            }
            const url = url_item + `/users`;

            const access_token = localStorage.getItem('access_token_Request');


            if (access_token) {
                const Item = { ...newItem, access_token: access_token };
                const response = await CreateRequest(url, Item);
                console.log(response);
                OptionMessageCreate(response);
            }
            else {
                setMessageError("Expiro la Session")
            }

        } catch (error) {
            setMessageError(`Error creating ${itemName}:` + (error as Error).message);
        }
    };

    const handleUpdate = async () => {
        if (updateId === null) return;

        try {

            const url = url_item + `/users/updateData`;
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = {
                    userID: updateId,
                    access_token: access_token,
                    name: newItem.name,
                    lastName: newItem.lastName,
                }

                const response = await UpdateRequest(url, config);
                OptionMessage(response);
            }

            else {
                setMessageError("Expiro la Session")
            }
        } catch (error) {
            setMessageError(`Error updating ${itemName}:` + (error as Error).message);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const url = url_item + `/Users`;
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const idsToDelete = selectedItems.map(item => item.id);

                for (const idToDelete of idsToDelete) {
                    const config = {
                        access_token: access_token,
                        userID: idToDelete,
                    }
                    const response = await DeleteRequest(url, config);
                    console.log(response);
                    OptionMessage(response);
                }
            }
            else {
                setMessageError("Expiro la Session")
            }
        } catch (error) {
            setMessageError(`Error deleting ${itemName}:` + (error as Error).message);
        }
    };

    const ChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (updateId === null) return;

        try {
            if (!isPasswordValid(newItem.password)) {
                setMessageError('Contraseña Invalida');
                return;
            }

            const url = url_item + `/users/updatePassword`;
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = {
                    userID: updateId,
                    access_token: access_token,
                    password: newItem.password,
                }

                const response = await UpdateRequest(url, config);
                OptionMessage(response);
            }

            else {
                setMessageError("Expiro la Session")
            }
        } catch (error) {
            setMessageError(`Error updating ${itemName}:` + (error as Error).message);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (updateId !== null) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleEdit = (item: Item) => {
        setUpdateId(item.id);
        setNewItem({
            id: item.id,
            name: item.name,
            lastName: item.lastName,
            email: '',
            password: ''
        });
        openLoginModal();
    };

    const handleEditPassword = (item: Item) => {
        setUpdateId(item.id);
        setNewItem({
            id: item.id,
            name: item.name,
            lastName: item.lastName,
            email: '',
            password: item.password,
        });
        openPasswordModal();
    };

    const clearItem = () => {
        setUpdateId(null);
        setNewItem({
            id: 0,
            name: '',
            lastName: '',
            email: '',
            password: ''
        });
    }

    const clearCheckbox = () => {
        setSelectedItems([]);
        setSelectAll(false);
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, item: Item) => {
        if (event.target.checked) {
            setSelectedItems(prevSelectedItems => [...prevSelectedItems, item]);
        } else {
            setSelectedItems(prevSelectedItems =>
                prevSelectedItems.filter(selectedItem => selectedItem.id !== item.id)
            );
        }
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(event.target.checked);
        setSelectedItems(event.target.checked ? items : []);
    };


    const OptionMessage = (data: any): void => {
        if (data.error) {
            if (data.error.message) {
                setMessageError(data.error.message)
            }
            setMessageError(data.error);
        } else if (data.message) {
            setMessageVerification(data.message);
            fetchItems();
        } else if (data.errors) {
            setMessageError(data.errors[0].msg);
        } else if (data) {
            setMessageError(data);
        } else {
            setMessageError('Error Inesperado');
        }
    };

    const OptionMessageCreate = (data: any): void => {
        if (data.error) {
            if (data.error.message) {
                setMessageError(data.error.message)
            }
            setMessageError(data.error);
        }
        else if (data.message) {
            setMessageError(data.message);
        } else if (data.errors) {
            setMessageError(data.errors[0].msg);
        } else if (data) {
            setMessageVerification("Usuario Creado Exitosamente");
            fetchItems();
            closeModal();
        } else {
            setMessageError('Error Inesperado');
        }
    };

    // -------------------------------Funciones para la Paginacion-------------------------------
    const [searchType, setSearchType] = useState<'id' | 'name' | 'lastName' | 'email'>('id');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'id' | 'name' | 'lastName' | 'email'>('id');

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems);

        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'id' | 'name' | 'lastName' | 'email') => {
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

    useEffect(() => {

        const obtenerTokenDeAcceso = async () => {
            await getSession();
            fetchItems();
        };

        obtenerTokenDeAcceso();

    }, [currentPage]);

    // // Variables del Componente Modal
    const [ModalOpen, setModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);

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

    // -------------------------------Funciones para los Modal-------------------------------
    // Funciones que activa el modal para loguearse
    const openLoginModal = () => {
        setModalOpen(true);
    };
    // Funcion que cierra el modal para loguearse
    const closeModal = () => {
        setModalOpen(false);
        closeAlert();
        clearItem();
    };
    // Funciones que activa el modal para cambiar de contraseña
    const openPasswordModal = () => {
        setPasswordModalOpen(true);
    };
    // Funcion que cierra el modal para cambiar de contraseña
    const closePasswordModal = (): void => {
        setPasswordModalOpen(false);
        closeAlert();
        clearItem();
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

            <ModalCRUD isOpen={ModalOpen}>
                <div className="mx-auto max-w-screen items-center">
                    <form onSubmit={handleSubmit} className="mb-0 space-y-4 rounded-lg p-4 sm:p-6">

                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
                            </h1>

                            <h2 className="text-center text-lg font-medium">
                                Panel de Administracion
                            </h2>

                            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                            </p>
                        </div>

                        <div>
                            {!updateId && (
                                <>
                                    <div className="relative flex items-center">
                                        <input
                                            type="email"
                                            id="email"
                                            value={newItem.email || ''}
                                            onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                                            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                            placeholder="Ingresar Email"
                                        />

                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                />
                                            </svg>
                                        </span>
                                    </div>

                                    <div className="relative flex items-center">
                                        <input
                                            type="password"
                                            id="password"
                                            value={newItem.password || ''}
                                            onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                                            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                            placeholder="Ingresar Contraseña"
                                        />

                                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </>
                            )}

                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    id="name"
                                    value={newItem.name || ''}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                    placeholder="Ingresar Nombre del Usuario"
                                />

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    id="lastName"
                                    value={newItem.lastName || ''}
                                    onChange={(e) => setNewItem({ ...newItem, lastName: e.target.value })}
                                    className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                    placeholder="Ingresar Apellido del Usuario"
                                />

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                            <div className="flex-1 w-80 sm:w-42">
                                <CustomButton onClick={handleSubmit} type="submit"
                                    color="indigo"
                                    padding_x="0"
                                    padding_smx="0"
                                    padding_mdx="0"
                                    padding_y="2.5"
                                    width="full"
                                    height="10"
                                >
                                    {!updateId && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}

                                    {updateId && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                            />
                                        </svg>
                                    )}

                                    {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
                                </CustomButton>
                            </div>
                            <div className="flex-1 w-80 sm:w-42">
                                <CustomButton onClick={closeModal} type="button"
                                    color="red"
                                    padding_x="0"
                                    padding_smx="0"
                                    padding_mdx="0"
                                    padding_y="2.5"
                                    width="full"
                                    height="10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                    Cancelar

                                </CustomButton>
                            </div>
                        </div>
                    </form>
                </div>
            </ModalCRUD>

            <ModalCRUD isOpen={passwordModalOpen}>
                <div className="mx-auto max-w-screen items-center">
                    <form
                        onSubmit={ChangePassword}
                        className="mb-0 space-y-4 rounded-lg p-4 sm:p-6"
                    >
                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Actualizacion de Contraseña
                            </h1>

                            <h2 className="text-center text-lg font-medium">

                            </h2>

                            <p className="mx-auto mt-4 max-w-md text-center text-sm text-gray-500">
                                La contraseña debe cumplir con las siguientes características:
                                <br />
                                - No se permite el uso de contraseñas repetidas.
                                <br />
                                - Debe tener una longitud mínima de 6 caracteres.
                                <br />
                                - Debe contener al menos una letra mayúscula.
                                <br />
                                - Debe contener al menos una letra minúscula.
                                <br />
                                - Debe contener al menos un número.
                                <br />- Debe contener al menos un carácter especial.
                            </p>
                        </div>

                        <div className="relative flex items-center">
                            <input
                                type="password"
                                id="password"
                                value={newItem.password || ''}
                                onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                placeholder="Ingresar Contraseña"
                            />

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                            <div className="flex-1 w-80 sm:w-42">
                                <CustomButton type="submit"
                                    color="indigo"
                                    padding_x="0"
                                    padding_smx="0"
                                    padding_mdx="0"
                                    padding_y="2.5"
                                    width="full"
                                    height="10"
                                >

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                                    </svg>

                                    Cambiar Contraseña
                                </CustomButton>

                            </div>
                            <div className="flex-1 w-80 sm:w-42">
                                <CustomButton onClick={closePasswordModal} type="button"
                                    color="red"
                                    padding_x="0"
                                    padding_smx="0"
                                    padding_mdx="0"
                                    padding_y="2.5"
                                    width="full"
                                    height="10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Cancelar
                                </CustomButton>
                            </div>
                        </div>
                    </form>
                </div>
            </ModalCRUD>


            <div className='min-h-screen mx-6 my-2'>

                <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between mb-4">

                    <div className='text-center md:text-start'>
                        <h1 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-gray-900">
                            Bienvenido al Panel de Administracion
                        </h1>
                        <p className="text-md sm:text-sm font-medium text-gray-500">
                            CRUD de Usurios
                        </p>
                    </div>

                    <div className='flex justify-center gap-2 mt-2'>


                        <CustomButton onClick={openLoginModal} type="button"
                            color="indigo"
                            padding_x="3"
                            padding_smx="8"
                            padding_mdx="12"
                            padding_y="2"
                            width="32"
                            height="15"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Crear {itemName}
                        </CustomButton>

                        <CustomButton onClick={fetchItems} type="button"
                            color="indigo"
                            padding_x="2"
                            padding_smx="2"
                            padding_mdx="2"
                            padding_y="0"
                            width="10"
                            height="15"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </CustomButton>

                        <CustomButton onClick={handleDeleteSelected} type="button"
                            color="red"
                            padding_x="3"
                            padding_smx="8"
                            padding_mdx="12"
                            padding_y="2"
                            width="32"
                            height="15"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                            Eliminar {itemName}
                        </CustomButton>

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
                                'id' | 'name' | 'lastName' | 'email'
                            )}
                        >
                            <option value="id">ID del Usuario</option>
                            <option value="name">Nombre del Usuario</option>
                            <option value="lastName">Apellido del Usuario</option>
                            <option value="email">Email del Usuario</option>
                        </select>
                    </div>

                </div>



                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm mt-4">

                        <thead className="ltr:text-left rtl:text-right">
                            <tr>

                                <th className="text-start px-4 py-2">
                                    <input
                                        type="checkbox"
                                        className='h-5 w-5 rounded border-gray-300'
                                        onChange={handleSelectAllChange}
                                        checked={selectAll}
                                    />
                                </th>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <div className='flex items-center gap-1'>
                                        ID del Usuario
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
                                </th>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <div className='flex items-center gap-1'>
                                        Nombre Completo del Usuario
                                        <button onClick={() => handleSortPropertyChange('name')}>

                                            {sortProperty === 'name' ? (
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
                                        <button onClick={() => handleSortPropertyChange('lastName')}>

                                            {sortProperty === 'lastName' ? (
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

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <div className='flex items-center gap-1'>
                                        ID de la {itemName}
                                        <button onClick={() => handleSortPropertyChange('email')}>

                                            {sortProperty === 'email' ? (
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
                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Metodos
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {getCurrentPageItems().map(item => (

                                <tr key={item.id} className='text-gray-600'>

                                    <td className="px-4 py-2">
                                        <div className='h-5 w-5 rounded border-gray-300'>
                                            <input
                                                type="checkbox"
                                                onChange={(event) => handleCheckboxChange(event, item)}
                                                checked={selectedItems.includes(item)}
                                            />
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.id}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        <div className='flex items-center'>
                                            <div className='bg-indigo-100 p-3 rounded-lg'>
                                                <BsPersonFill className='text-indigo-500' />
                                            </div>
                                            <p className='text-gray-600 pl-4'>{item.name + ' ' + item.
                                                lastName}</p>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.email}
                                    </td>

                                    <td className="flex justify-center items-center space-x-4 px-4 py-2">
                                        <CustomButton onClick={() => handleEdit(item)} type="button"
                                            color="indigo"
                                            padding_x="4"
                                            padding_smx="6"
                                            padding_mdx="8"
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
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                />
                                            </svg>
                                            Editar
                                        </CustomButton>

                                        <CustomButton onClick={() => handleEditPassword(item)} type="button"
                                            color="indigo"
                                            padding_x="0"
                                            padding_smx="0"
                                            padding_mdx="0"
                                            padding_y="2"
                                            width="48"
                                            height="10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                                            </svg>
                                            Cambiar Contraseña
                                        </CustomButton>
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

export default UsersAdminCRUD;
