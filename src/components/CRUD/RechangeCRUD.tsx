import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';
import NumberInput from '../Widgets/Imput/NumberInput';

import { CreateRequestFile, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import FileDropzone from '../Widgets/Imput/FileDropzone';
import SearchCurrencyTypeSelect from '@/components/Search/SearchCurrencyTypeSelect';
import FormContainer from './Form/FormContainer';
import ItemListHeader from '../Widgets/ItemListHeader';
import PaginationButtons from './PaginationButtons';
import { toLocaleString } from '@/utils/DateUtils';
import SearchComponent from '../Search/SearchComponent';
import ModalImage from '../Widgets/ModalImage';
import { filterItems, sortItems } from '@/utils/SearchFilter';

interface Item {
    rechargeid: number;
    vehicleHasTripID: number;
    currencyTypeID: number;
    documentsID: number;
    cashMovementID: number;
    quantity: number;
    dollar: number;
    currencyType: number;
    abreviation: string;
    name: string;
    photo: string;
    dateRecharge: Date;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

interface RechangeCRUDProps {
    urls: string[];
    title: string;
    subtitle: string;
    role: boolean;
}

const RechangeCRUD: React.FC<RechangeCRUDProps> = ({ urls, title, subtitle, role }) => {

    const [itemName] = useState<string>('Recarga');
    const router = useRouter();
    const [isChofer] = useState<boolean>(role);
    const { id, organizationID } = router.query;

    const [items, setItems] = useState<Item[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currencyType, setcurrencyType] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<string>('');
    const [urlImage, setUrlImage] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState<Item>({
        rechargeid: 0,
        vehicleHasTripID: 0,
        currencyTypeID: 0,
        documentsID: 0,
        cashMovementID: 0,
        quantity: 0,
        dollar: 0,
        currencyType: 0,
        abreviation: '',
        name: '',
        photo: '',
        dateRecharge: new Date(),
    });

    const [updateId, setUpdateId] = useState<number | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    // -------------------------------Funciones Para el CRUD-------------------------------
    const handleFileChange = async (file: File | null) => {
        // Aquí puedes realizar acciones con el archivo seleccionado
        setSelectedFile(file);
        setMessageVerification("Se ha Cargado el Archivo");

    };

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

    const handleCreate = async () => {
        try {
            const url = urls[1] || '';

            const access_token = localStorage.getItem('access_token_Request');

            if (selectedFile) {
                if (access_token) {
                    const Item = {
                        access_token: access_token,
                        organizationID: organizationID,
                        vehicleHasTripID: id,
                        documentsID: selectedDocument,
                        dateRecharge: new Date(),
                        currencyType: currencyType,
                        quantity: newItem.quantity
                    };
                    const formData = new FormData();
                    formData.append('avatar', selectedFile);
                    const response = await CreateRequestFile(url, Item, formData);
                    console.log(Item)
                    console.log(selectedFile)
                    console.log(response);
                    OptionMessage(response);
                }
                else {
                    setMessageError("Expiro la Session")
                }
            }
            else {
                setMessageError("Tiene que subir un Archivo")
            }

        } catch (error) {
            setMessageError(`Error creating ${itemName}:` + (error as Error).message);
        }
    };

    const handleUpdate = async () => {
        if (updateId === null) return;

        try {

            const url = urls[2] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = {
                    rechargeid: updateId,
                    access_token: access_token,
                    vehicleHasTripID: newItem.vehicleHasTripID,
                    organizationID: id,
                    cashMovementID: newItem.cashMovementID,
                    documentsID: newItem.documentsID,
                    dateRecharge: new Date(),
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
            const url = urls[3] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const idsToDelete = selectedItems.map(item => item.cashMovementID);
                for (const idToDelete of idsToDelete) {
                    const config = {
                        access_token: access_token,
                        cashMovementID: idToDelete,
                        organizationID: organizationID,
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (updateId !== null) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };

    const clearItem = () => {
        setUpdateId(null);
        setNewItem({
            rechargeid: 0,
            vehicleHasTripID: 0,
            currencyTypeID: 0,
            documentsID: 0,
            cashMovementID: 0,
            quantity: 0,
            dollar: 0,
            currencyType: 0,
            abreviation: '',
            name: '',
            photo: '',
            dateRecharge: new Date(),
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
                prevSelectedItems.filter(selectedItem => selectedItem.cashMovementID !== item.cashMovementID)
            );
        }
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(event.target.checked);
        setSelectedItems(event.target.checked ? items : []);
    };

    const OptionMessage = (data: any): void => {
        if (data.error) {
            if(data.error.message){
                setMessageError(data.error.message);
                return
            }
            setMessageError("Error durante el proceso de Carga");
        }
        else if (data.message) {
            if (data.message == "La recarga se subió exitosamente" ||
                data.message == "Se eliminó la recarga exitosamente" ||
                data.message == "Se eliminó exitosamente"
            ) {
                setMessageVerification(data.message);
                fetchItems();
                closeModal();
                return;
            }
            else if (data.message == "El chofer no tiene relación con el viaje" ||
                data.message == "No se ha subido ningun archivo") {
                setMessageError(data.message);
                router.push('/Transport/MyParticipation');
            }
            setMessageError(data.message);
        }
        else if (data.errors) {
            setMessageError(data.errors[0].msg);
        }
        else if (data) {
            setMessageError(data);
        } else {
            setMessageError('Error Inesperado');
        }
    };

    // -------------------------------Funciones para la Paginacion-------------------------------
    const [searchType, setSearchType] = useState<'rechargeid' | 'vehicleHasTripID' | 'currencyTypeID' | 'documentsID' | 'quantity' | 'dollar' | 'currencyType' | 'abreviation' | 'name' | 'dateRecharge'>('rechargeid');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'rechargeid' | 'vehicleHasTripID' | 'currencyTypeID' | 'documentsID' | 'quantity' | 'dollar' | 'currencyType' | 'abreviation' | 'name' | 'dateRecharge'>('rechargeid');


    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
        const filteredItems = filterItems(items, searchTerm, searchType);

        // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
        const sortedItems = sortItems(filteredItems, sortProperty, sortDirection);

        return sortedItems.slice(startIndex, endIndex);
    };

    const handleSortPropertyChange = (property: 'rechargeid' | 'vehicleHasTripID' | 'currencyTypeID' | 'documentsID' | 'quantity' | 'dollar' | 'currencyType' | 'abreviation' | 'name' | 'dateRecharge') => {
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
    // // Variables del Componente Modal
    const [ModalOpen, setModalOpen] = useState(false);
    const [ModalImageOpen, setImageModalOpen] = useState(false);
    // Funciones que activa el modal para loguearse
    const openLoginModal = () => {
        setModalOpen(true);
    };
    // Funcion que cierra el modal para loguearse
    const closeModal = () => {
        setModalOpen(false);
        clearItem();
    };

    // Funciones que activa el modal para las Imagenes
    const openImageModal = (photo: string) => {
        setUrlImage(photo);
        setImageModalOpen(true);
    };
    // Funcion que cierra el modal para las Imagenes
    const closeImageModal = () => {
        setImageModalOpen(false);
    };

    return (
        <div>
            {messageError && (
                <Alert message={messageError} onClose={closeAlert} />
            )}
            {messageVerification && (
                <AlertVerification message={messageVerification} onClose={closeAlert} />
            )}

            <ModalImage ulrImage={urlImage} isOpen={ModalImageOpen} onClose={closeImageModal} />

            <ModalCRUD isOpen={ModalOpen}>
                <FormContainer updateId={updateId} itemName={itemName} h2Text={''} pText={''} handleSubmit={handleSubmit} closeModal={closeModal}>
                    <div className="relative flex items-center">
                        <select
                            id="marker1"
                            className="w-full h-10 rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument((e.target.value))}
                        >
                            <option value="-1">Seleccione Tipo</option>
                            <option value="1">Boleta</option>
                            <option value="2">Factura</option>
                        </select>
                    </div>
                    <NumberInput
                        value={newItem.quantity}
                        onChange={(value) => setNewItem({ ...newItem, quantity: value })}
                        placeholder="Ingresar Cantidad"
                    />
                    <SearchCurrencyTypeSelect setItemID={setcurrencyType} />
                    <FileDropzone onFileChange={handleFileChange} />
                </FormContainer>
            </ModalCRUD>

            <div className='min-h-screen mx-6 my-2'>
                {isChofer && (
                    <ItemListHeader
                        title={title}
                        subtitle={subtitle}
                        itemName={itemName}
                        openLoginModal={openLoginModal}
                        fetchItems={fetchItems}
                        handleDeleteSelected={handleDeleteSelected}
                    />
                )}

                {!isChofer && (
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
                )}

                <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                    <select
                        className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as 'rechargeid' | 'vehicleHasTripID' | 'currencyTypeID' | 'documentsID' | 'quantity' | 'dollar' | 'currencyType' | 'abreviation' | 'name' | 'dateRecharge')}
                    >
                        <option value="rechargeid">ID de la {itemName}</option>
                        <option value="name">Tipo de Formato</option>
                        <option value="quantity">Cantidad</option>
                        <option value="abreviation">Tipo de Moneda</option>
                        <option value="dollar">Dolar</option>
                        <option value="dateRecharge">Fecha de Subida</option>
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
                                        ID de la {itemName}
                                        <button onClick={() => handleSortPropertyChange('rechargeid')}>

                                            {sortProperty === 'rechargeid' ? (
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
                                        Tipo de Formato
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
                                    </div>
                                </th>
                                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    <div className='flex items-center gap-1'>
                                        Valor
                                        <button onClick={() => handleSortPropertyChange('quantity')}>

                                            {sortProperty === 'quantity' ? (
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
                                        Tipo de Moneda
                                        <button onClick={() => handleSortPropertyChange('abreviation')}>

                                            {sortProperty === 'abreviation' ? (
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
                                        Dolares (USD)
                                        <button onClick={() => handleSortPropertyChange('dollar')}>

                                            {sortProperty === 'dollar' ? (
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
                                        Fecha de Subida
                                        <button onClick={() => handleSortPropertyChange('dateRecharge')}>

                                            {sortProperty === 'dateRecharge' ? (
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
                                    Metodos
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y text-gray-600 ">
                            {getCurrentPageItems().map(item => (

                                <tr key={item.rechargeid}>

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
                                        {item.rechargeid}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.name}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.quantity}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.abreviation}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {item.dollar}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-2 font-medium">
                                        {toLocaleString(item.dateRecharge)}
                                    </td>

                                    <td className="flex justify-center items-center space-x-4 px-4 py-2">
                                        <CustomButton onClick={() => openImageModal(item.photo)} type="button"
                                            color="indigo"
                                            padding_x="0"
                                            padding_smx="0"
                                            padding_mdx="0"
                                            padding_y="0"
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
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            Ver Imagen
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

export default RechangeCRUD;
