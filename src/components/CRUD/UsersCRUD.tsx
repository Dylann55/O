import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BsPersonFill } from 'react-icons/bs';

import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';

import { CreateRequest, DeleteRequest, ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import RoleCRUD from './RoleCRUD';
import { filterItems, sortItems } from '@/utils/SearchFilter';
import FormContainer from './Form/FormContainer';
import TextInput from '../Widgets/Imput/TextInput';
import PaginationButtons from './PaginationButtons';
import SearchComponent from '../Search/SearchComponent';

interface Item {
    userHasProfile: number;
    userID: string;
    profileID: number;
    roles: string;
    rut: string;
    name: string;
    lastName: string;
    email: string;
    organizationname: string;
    organizationID: number;
}

type Profile = {
    profileIDs: number[];
};

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

interface UsersCRUDProps {
    urls: string[];
    urlsRole: string[];
    title: string;
    subtitle: string;
}

const UsersCRUD: React.FC<UsersCRUDProps> = ({ urls, urlsRole, title, subtitle }) => {

    const [itemName] = useState<string>('Perfil');
    const router = useRouter();
    const { id, name } = router.query;

    const Role = urls[4] || '';
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Item>({
        userHasProfile: 0,
        userID: '',
        profileID: 0,
        roles: '',
        rut: '',
        name: '',
        lastName: '',
        email: '',
        organizationID: 0,
        organizationname: '',
    });

    const [Profile, setProfile] = useState<Profile>({
        profileIDs: [],
    });


    const [selectAll, setSelectAll] = useState(false);
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
                    organizationID: id,
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

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        try {

            for (const profileID of Profile.profileIDs) {

                const url = urls[1] || '';

                const access_token = localStorage.getItem('access_token_Request');
                if (access_token) {
                    const Item = { ...newItem, access_token: access_token, organizationID: id, profileID: profileID };
                    const response = await CreateRequest(url, Item);
                    console.log(response);
                    OptionMessage(response);

                }
                else {
                    setMessageError("Expiro la Session")
                }
            }
        } catch (error) {
            setMessageError(`Error creating ${itemName}:` + (error as Error).message);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const url = urls[2] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const idsToDelete = selectedItems.map(item => item.userID);
                for (const idToDelete of idsToDelete) {
                    const config = {
                        access_token: access_token,
                        userID: idToDelete,
                        organizationID: id,
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

    const inviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            const url = urls[3] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = {
                    access_token: access_token,
                    organizationID: id,
                    email: newItem.email,
                    name: newItem.name,
                    rut: newItem.rut,
                    lastName: newItem.lastName,
                }
                const response = await CreateRequest(url, config);
                OptionMessage(response);

            }

            else {
                setMessageError("Expiro la Session")
            }
        } catch (error) {
            setMessageError(`Error updating ${itemName}:` + (error as Error).message);
        }
    };

    const clearItem = () => {
        setNewItem({
            userHasProfile: 0,
            userID: '',
            profileID: 0,
            roles: '',
            rut: '',
            name: '',
            lastName: '',
            email: '',
            organizationname: '',
            organizationID: 0
        });
        setProfile({
            profileIDs: [],
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
                prevSelectedItems.filter(selectedItem => selectedItem.userID !== item.userID)
            );
        }
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(event.target.checked);
        setSelectedItems(event.target.checked ? items : []);
    };

    const handleCheckboxProfile = (profileID: number) => {
        if (Profile.profileIDs.includes(profileID)) {
            // Si el perfil ya está seleccionado, lo eliminamos
            setProfile({ ...newItem, profileIDs: Profile.profileIDs.filter(id => id !== profileID) });
        } else {
            // Si el perfil no está seleccionado, lo agregamos
            setProfile({ ...newItem, profileIDs: [...Profile.profileIDs, profileID] });
        }
    };

    const OptionMessage = (data: any): void => {
        if (data.error) {
            setMessageError(data.error);
        }
        else if (data.message) {
            if (data.message == "Se eliminaron todos los perfiles del usuario en la empresa" ||
                data.message == "Perfil de usuario agregado" ||
                data.message == "Usuario nuevo invitado" ||
                data.message == "Usuario invitado" ||
                data.message == "Se creo el perfil de usuario exitosamente" ||
                data.message == "se eliminaron los usuarios de la empresa exitosamente" ||
                data.message == "Se creo el perfil de usuario exitosamente"
            ) {
                setMessageVerification(data.message);
                fetchItems();
                closeModal();
                closeInviteModal();
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

    // -------------------------------Funciones para la Paginacion-------------------------------

    const [searchType, setSearchType] = useState<'userID' | 'rut' | 'name' | 'lastName' | 'email'>('userID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'userID' | 'rut' | 'name' | 'lastName' | 'email'>('userID');

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items, searchTerm, searchType);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems, sortProperty, sortDirection);

        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'userID' | 'rut' | 'name' | 'lastName' | 'email') => {
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

    // // Variables del Componente Modal
    const [ModalOpen, setModalOpen] = useState(false);
    const [InviteModalOpen, setInviteModalOpen] = useState(false);

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
    // Funciones que activa el modal para invitar a un usuario
    const openInviteModal = () => {
        setInviteModalOpen(true);
    };
    // Funcion que cierra el modal para invitar a un usuario
    const closeInviteModal = (): void => {
        setInviteModalOpen(false);
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
                <FormContainer updateId={''} itemName={itemName} h2Text={`Gestion de ${itemName}es para ${name}`} pText={''} handleSubmit={handleCreate} closeModal={closeModal}>
                    <TextInput
                        value={newItem.userID}
                        onChange={(e) => setNewItem({ ...newItem, userID: e.target.value })}
                        placeholder="Ingresar Patente del Vehiculo"
                    />
                    <div className="flex flex-col items-center mt-4 gap-2 sm:gap-8 sm:flex-row sm:justify-center">

                        <label htmlFor="HeadlineAct" className="text-sm text-gray-700">
                            Seleccione Rol
                        </label>

                        <div className="flex gap-8">

                            <div className='space-x-2'>
                                <input
                                    type="checkbox"
                                    checked={Profile.profileIDs.includes(2)}
                                    onChange={() => handleCheckboxProfile(2)}
                                    className="h-5 w-5 rounded border-gray-300"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Jefe
                                </label>
                            </div>

                            <div className='space-x-2'>
                                <input
                                    type="checkbox"
                                    checked={Profile.profileIDs.includes(3)}
                                    onChange={() => handleCheckboxProfile(3)}
                                    className="h-5 w-5 rounded border-gray-300"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Proveedor
                                </label>
                            </div>

                            <div className='space-x-2'>
                                <input
                                    type="checkbox"
                                    checked={Profile.profileIDs.includes(4)}
                                    onChange={() => handleCheckboxProfile(4)}
                                    className="h-5 w-5 rounded border-gray-300"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Chofer
                                </label>
                            </div>

                        </div>

                    </div>
                </FormContainer>
            </ModalCRUD>

            <ModalCRUD isOpen={InviteModalOpen}>
                <div className="mx-auto max-w-screen items-center">
                    <form onSubmit={inviteUser} className="mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">

                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Invitacion a {name}
                            </h1>

                            <h2 className="text-center text-lg font-medium">
                                Invitacion como chofer
                            </h2>

                            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                            </p>
                        </div>

                        <div>
                            <TextInput
                                value={newItem.email}
                                onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                                placeholder="Ingresar Email del Usuario"
                            />

                            <TextInput
                                value={newItem.rut}
                                onChange={(e) => setNewItem({ ...newItem, rut: e.target.value })}
                                placeholder="Ingresar Rut del Usuario"
                            />

                            <TextInput
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="Ingresar Nombre del Usuario"
                            />
                            <TextInput
                                value={newItem.lastName}
                                onChange={(e) => setNewItem({ ...newItem, lastName: e.target.value })}
                                placeholder="Ingresar Apellido del Usuario"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                            <div className="flex-1 w-full sm:w-48">
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>

                                    Invitar Usuario
                                </CustomButton>
                            </div>

                            <div className="flex-1 w-full sm:w-48">

                                <CustomButton onClick={closeInviteModal} type="button"
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
                            {title}
                        </h1>
                        <p className="text-md sm:text-sm font-medium text-gray-500">
                            {subtitle}
                        </p>
                    </div>

                    <div className='flex justify-center gap-1 sm:gap-2 mt-2'>

                        <CustomButton onClick={openLoginModal} type="button"
                            color="indigo"
                            padding_x="3"
                            padding_smx="8"
                            padding_mdx="12"
                            padding_y="2"
                            width="60"
                            height="15"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Crear {itemName}
                        </CustomButton>

                        {Role != 'Administrator' && (

                            <CustomButton onClick={openInviteModal} type="button"
                                color="indigo"
                                padding_x="2"
                                padding_smx="2"
                                padding_mdx="2"
                                padding_y="2"
                                width="10"
                                height="15"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>

                            </CustomButton>

                        )}

                        <CustomButton onClick={fetchItems} type="button"
                            color="indigo"
                            padding_x="2"
                            padding_smx="2"
                            padding_mdx="2"
                            padding_y="2"
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
                            width="60"
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

                <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                    <select
                        className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as
                            'userID' | 'rut' | 'name' | 'lastName' | 'email'
                        )}
                    >
                        <option value="userID">ID del Usuario</option>
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
                                    Roles
                                </th>

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Metodos
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {getCurrentPageItems().map(item => (

                                <tr key={item.userID} className='text-gray-600'>

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
                                        {item.userID}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.rut}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        <div className='flex items-center'>
                                            <div className='bg-indigo-100 p-3 rounded-lg'>
                                                <BsPersonFill className='text-indigo-500' />
                                            </div>
                                            <p className='text-gray-600 pl-4'>{item.name + ' ' + item.lastName}</p>
                                        </div>
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
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


                                    <td className="px-4 py-2">
                                        <RoleCRUD urls={urlsRole} id={item.userID} OrganizacionID={item.organizationID} name={item.organizationname} handleFetchItems={fetchItems} />
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} />
            </div >

        </div >
    );
};

export default UsersCRUD;
