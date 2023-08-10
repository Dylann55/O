import React, { useState, useEffect } from 'react';

import { BsPersonFill } from 'react-icons/bs';
import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';

import { CreateRequest, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import { isPasswordValid } from '@/utils/VerifyUser';
import { filterItems, sortItems } from '@/utils/SearchFilter';
import FormContainer from './Form/FormContainer';
import TextInput from '../Widgets/Imput/TextInput';
import ItemListHeader from '../Widgets/ItemListHeader';
import SearchComponent from '../Search/SearchComponent';
import PaginationButtons from './PaginationButtons';

interface Item {
    id: number;
    name: string;
    email: string;
    lastName: string;
    password: string;
    rut: string;
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
        password: '',
        rut: ''
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
                if (!response.error && !response.errors) {
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
                    rut: newItem.rut
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
            password: '',
            rut: item.rut
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
            rut: item.rut
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
            password: '',
            rut: ''
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
            if (data.message == "Se eliminó exitosamente" ||
                data.message == "Se actualizo exitosamente" ||
                data.message == "La contraseña se actualizó exitosamente"
            ) {
                setMessageVerification(data.message);
                fetchItems();
                closeModal();
                closePasswordModal();
                return;
            }
            setMessageError(data.message);
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
            if (data.message == "Se ha creado el usuario exitosamente"
            ) {
                setMessageVerification(data.message);
                fetchItems();
                closeModal();
                return;
            }
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
    const [searchType, setSearchType] = useState<'id' | 'name' | 'lastName' | 'email' | 'rut'>('id');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'id' | 'name' | 'lastName' | 'email' | 'rut'>('id');

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items, searchTerm, searchType);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems, sortProperty, sortDirection);

        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'id' | 'name' | 'lastName' | 'email' | 'rut') => {
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
        clearItem();
    };
    // Funciones que activa el modal para cambiar de contraseña
    const openPasswordModal = () => {
        setPasswordModalOpen(true);
    };
    // Funcion que cierra el modal para cambiar de contraseña
    const closePasswordModal = (): void => {
        setPasswordModalOpen(false);
        clearItem();
    };

    return (
        <div>

            {messageError && (
                <Alert message={messageError} onClose={closeAlert} />
            )}
            {messageVerification && (
                <AlertVerification message={messageVerification} onClose={closeAlert} />
            )}

            <ModalCRUD isOpen={ModalOpen}>
                <FormContainer updateId={updateId} itemName={itemName} h2Text={"Panel de Administracion"} pText={''} handleSubmit={handleSubmit} closeModal={closeModal}>
                    {!updateId && (
                        <>
                            <TextInput
                                value={newItem.email}
                                onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                                placeholder="Ingresar Email"
                            />
                            <TextInput
                                value={newItem.password}
                                onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                                placeholder="Ingresar Contraseña"
                            />
                        </>
                    )}
                    <TextInput
                        value={newItem.rut}
                        onChange={(e) => setNewItem({ ...newItem, rut: e.target.value })}
                        placeholder="Ingresar Rut"
                    />
                    <TextInput
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Ingresar Nombre"
                    />
                    <TextInput
                        value={newItem.lastName}
                        onChange={(e) => setNewItem({ ...newItem, lastName: e.target.value })}
                        placeholder="Ingresar Apellido"
                    />
                </FormContainer>
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

                        <TextInput
                            value={newItem.password}
                            onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                            placeholder="Ingresar Contraseña"
                        />

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                            <div className="flex-1 w-96 sm:w-52">
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
                            <div className="flex-1 w-96 sm:w-52">
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

                <ItemListHeader title={"Bienvenido al Panel de Administracion"} subtitle={"CRUD de Usurios"} itemName={itemName} openLoginModal={openLoginModal} fetchItems={fetchItems} handleDeleteSelected={handleDeleteSelected} />

                <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                    <select
                        className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as
                            'id' | 'name' | 'lastName' | 'email' | 'rut'
                        )}
                    >
                        <option value="id">ID del Usuario</option>
                        <option value="rut">Rut del Usuario</option>
                        <option value="name">Nombre del Usuario</option>
                        <option value="lastName">Apellido del Usuario</option>
                        <option value="email">Email del Usuario</option>
                    </select>
                </SearchComponent>

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
                                        Rut del Usuario
                                        <button onClick={() => handleSortPropertyChange('rut')}>

                                            {sortProperty === 'rut' ? (
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
                                        {item.rut}
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

                <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} />
            </div>

        </div>
    );
};

export default UsersAdminCRUD;
