import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { BsPersonFill } from 'react-icons/bs';
import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';

import { CreateRequest, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import Link from 'next/link';

interface Item {
    userHasProfile: number;
    userID: string;
    profileID: number;
    roles: string;
    name: string;
    lastName: string;
    email: string;
}

type Profile = {
    profileIDs: number[];
};

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina
const url_item = process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage';

const UsersCRUD: React.FC = () => {

    const [itemName] = useState<string>('Perfil');
    const router = useRouter();
    const { id, name } = router.query;

    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Item>({
        userHasProfile: 0,
        userID: '',
        profileID: 0,
        roles: '',
        name: '',
        lastName: '',
        email: ''
    });

    const [Profile, setProfile] = useState<Profile>({
        profileIDs: [],
    });

    const [updateId, setUpdateId] = useState<number | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // -------------------------------Funciones Para el CRUD-------------------------------

    const fetchItems = async () => {
        try {
            const url = url_item + `/userOrganizationRoles`;

            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                const config = {
                    access_token: access_token,
                    organizationID: id,
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

            for (const profileID of Profile.profileIDs) {

                const url = url_item + `/createProfileUser`;

                const access_token = localStorage.getItem('access_token_Request');
                console.log(Profile);
                if (access_token) {
                    const Item = { ...newItem, access_token: access_token, organizationID: id, profileID: profileID };
                    console.log(Item);
                    const response = await CreateRequest(url, Item);
                    console.log(response);

                }
                else {
                    setMessageError("Expiro la Session")
                }
            }
        } catch (error) {
            setMessageError(`Error creating ${itemName}:` + (error as Error).message);
        }
    };

    const handleUpdate = async () => {
        if (updateId === null) return;

        try {

            for (const profileID of Profile.profileIDs) {

                const url = url_item + `/updateTransportMaxWeight`;
                const access_token = localStorage.getItem('access_token_Request');
                if (access_token) {

                    const config = {
                        userHasProfile: updateId,
                        userID: newItem.userID,
                        access_token: access_token,
                        profileID: profileID,
                        organizationID: id,
                    }

                    const response = await UpdateRequest(url, config);
                    OptionMessage(response);
                }

                else {
                    setMessageError("Expiro la Session")
                }
            }
        } catch (error) {
            setMessageError(`Error updating ${itemName}:` + (error as Error).message);
        }
    };

    const handleoutdate = async () => {
        if (updateId === null) return;

        try {

            for (const profileID of Profile.profileIDs) {

                const url = url_item + `/updateTransportMaxWeight`;
                const access_token = localStorage.getItem('access_token_Request');
                if (access_token) {

                    const config = {
                        userHasProfile: updateId,
                        userID: newItem.userID,
                        access_token: access_token,
                        profileID: profileID,
                        organizationID: id,
                    }

                    const response = await UpdateRequest(url, config);
                    OptionMessage(response);
                }

                else {
                    setMessageError("Expiro la Session")
                }
            }
        } catch (error) {
            setMessageError(`Error updating ${itemName}:` + (error as Error).message);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            const url = url_item + `/deleteTransport`;
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const idsToDelete = selectedItems.map(item => item.userHasProfile);
                for (const idToDelete of idsToDelete) {
                    const config = {
                        access_token: access_token,
                        userHasProfile: idToDelete,
                        organizationID: id,
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

    const inviteUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            const url = url_item + `/registerUser`;
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = {
                    access_token: access_token,
                    organizationID: id,
                    email: newItem.email,
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (updateId !== null) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const handleEdit = (item: Item) => {
        setNewItem({
            userHasProfile: item.userHasProfile,
            userID: item.userID,
            profileID: item.profileID,
            roles: '',
            name: '',
            lastName: '',
            email: ''
        });
        openLoginModal();
    };

    const clearItem = () => {
        setUpdateId(null);
        setNewItem({
            userHasProfile: 0,
            userID: '',
            profileID: 0,
            roles: '',
            name: '',
            lastName: '',
            email: ''
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
                prevSelectedItems.filter(selectedItem => selectedItem.userHasProfile !== item.userHasProfile)
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
            if (data.message == "Se actualizo el peso máximo con éxito" || data.message == "Se ha eliminado el transporte exitosamente" ||
                data.message == "se ha agregado el transporte a la empresa exitosamente" ||
                data.message == "Usuario nuevo invitado") {
                setMessageVerification(data.message);
                fetchItems();
                closeModal();
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
                <div className="mx-auto mt-10 max-w-screen items-center px-6 sm:px-8">
                    <form onSubmit={handleSubmit} className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">

                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
                            </h1>

                            <h2 className="text-center text-lg font-medium">
                                Gestion de {itemName}es para {name}
                            </h2>

                            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                            </p>
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    id="userID"
                                    value={newItem.userID || ''}
                                    onChange={(e) => setNewItem({ ...newItem, userID: e.target.value })}
                                    className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                    placeholder="Ingresar ID del Usuario"
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

                            <div className="flex flex-col items-center mt-4 gap-2 sm:flex-row sm:justify-center">

                                <div className="flex gap-2 sm:gap-14">

                                    <label htmlFor="HeadlineAct" className="text-sm text-gray-700">
                                        Seleccione Rol
                                    </label>

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
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">

                            <CustomButton onClick={handleSubmit} type="submit"
                                color="indigo"
                                padding_x="12"
                                padding_smx="12"
                                padding_mdx="12"
                                padding_y="2.5"
                                width="32"
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

                            <CustomButton onClick={closeModal} type="button"
                                color="red"
                                padding_x="20"
                                padding_smx="20"
                                padding_mdx="20"
                                padding_y="2.5"
                                width="32"
                                height="10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                Cancelar

                            </CustomButton>

                        </div>
                    </form>
                </div>
            </ModalCRUD>

            <ModalCRUD isOpen={InviteModalOpen}>
                <div className="mx-auto mt-10 max-w-screen items-center px-6 sm:px-8">
                    <form onSubmit={inviteUser} className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">

                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
                            </h1>

                            <h2 className="text-center text-lg font-medium">
                                Invitacion de Usuario para {name}
                            </h2>

                            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                            </p>
                        </div>

                        <div>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    id="userID"
                                    value={newItem.email || ''}
                                    onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                                    className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                                    placeholder="Ingresar Email del Usuario"
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

                            <CustomButton type="submit"
                                color="indigo"
                                padding_x="12"
                                padding_smx="12"
                                padding_mdx="12"
                                padding_y="2.5"
                                width="32"
                                height="10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                Invitar {itemName}
                            </CustomButton>

                            <CustomButton onClick={closeInviteModal} type="button"
                                color="red"
                                padding_x="20"
                                padding_smx="20"
                                padding_mdx="20"
                                padding_y="2.5"
                                width="32"
                                height="10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                Cancelar

                            </CustomButton>

                        </div>
                    </form>
                </div>
            </ModalCRUD>

            <div className=' bg-gray-100 min-h-screen pt-3 mx-2'>

                <div className='flex flex-col items-center gap-2 sm:flex-row sm:justify-center'>

                    <CustomButton onClick={openInviteModal} type="button"
                        color="indigo"
                        padding_x="8"
                        padding_smx="8"
                        padding_mdx="8"
                        padding_y="2"
                        width="64"
                        height="15"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Invitar {itemName}
                    </CustomButton>

                    <CustomButton onClick={openLoginModal} type="button"
                        color="indigo"
                        padding_x="8"
                        padding_smx="8"
                        padding_mdx="8"
                        padding_y="2"
                        width="64"
                        height="15"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Crear {itemName}
                    </CustomButton>

                    <CustomButton onClick={handleDeleteSelected} type="button"
                        color="red"
                        padding_x="8"
                        padding_smx="8"
                        padding_mdx="8"
                        padding_y="2"
                        width="64"
                        height="15"
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                        </svg>
                        Eliminar {itemName}
                    </CustomButton>

                </div>

                <div className="mx-2 sm:mx-4 overflow-x-auto">

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

                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Metodos
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {getCurrentPageItems().map(item => (

                                <tr key={item.userID}>

                                    <td className="px-4 py-2">
                                        <div className='h-5 w-5 rounded border-gray-300'>
                                            <input
                                                type="checkbox"
                                                onChange={(event) => handleCheckboxChange(event, item)}
                                                checked={selectedItems.includes(item)}
                                            />
                                        </div>
                                    </td>

                                    <td className="text-gray-600 whitespace-nowrap px-4 py-2 font-medium">
                                        {item.userID}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        <div className='flex items-center'>
                                            <div className='bg-indigo-100 p-3 rounded-lg'>
                                                <BsPersonFill className='text-indigo-500' />
                                            </div>
                                            <p className='text-gray-600 pl-4'>{item.name + ' ' + item.lastName}</p>
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


                                    <td className="px-4 py-2">

                                        <Link href={`/Organization/User/${item.userID}?name=${encodeURIComponent(item.name)}`}>
                                            <CustomButton type="button"
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
                                                    <path strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />

                                                </svg>
                                                Editar Roles
                                            </CustomButton>
                                        </Link>
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

export default UsersCRUD;
