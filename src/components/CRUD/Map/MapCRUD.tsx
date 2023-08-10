import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LoadScript } from '@react-google-maps/api';

import CustomMap from '@/components/Map/CustomMap';
import CustomButton from '@/components/Widgets/Button/CustomButton';
import ModalCRUD from '@/components/Widgets/ModalCRUD';
import Alert from '@/components/Widgets/Alert';
import AlertVerification from '@/components/Widgets/AlertVerification';

import { CreateRequest, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import NumberInput from '@/components/Widgets/Imput/NumberInput';
import { toLocaleString } from '@/utils/DateUtils';
import Link from 'next/link';
import SearchProfileIDSelect from '@/components/Search/SearchProfileIDSelect';
import SearchVehiculeIDSelect from '@/components/Search/SearchVehiculeIDSelect';
import SearchComponent from '@/components/Search/SearchComponent';
import PaginationButtons from '../PaginationButtons';
import FormContainer from '../Form/FormContainer';
import TextInput from '@/components/Widgets/Imput/TextInput';

interface Profile {
    userHasProfile: number;
    profileID: number;
    organizationID: number;
    fullName: string;
}

interface Vehicule {
    vehicleID: number;
    patent: string;
    mark: string;
    model: string;
    maxWeight: number;
}

interface MarkerData {
    name: string;
    latitude: number | null;
    longitude: number | null;
}

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
    maxWeight: number;
    diferenceWeight: number;
    distanceTravelInitial: number;
    distanceTravelFinal: number;
}

interface MapCRUDProps {
    urls: string[];
    title: string;
    subtitle: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

const MapCRUD: React.FC<MapCRUDProps> = ({ urls, title, subtitle }) => {

    const [itemName] = useState<string>('Ruta');

    // -------------------------------Funciones Sobre las Marcas, son locales-------------------------------
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

    // -------------------------------Funciones Sobre las Rutas o Marcas-------------------------------
    const [isRoute, setIsRoute] = useState<boolean>(false);

    const handleIsMarker = () => {
        setIsRoute(false);
    }

    const handleIsRoute = () => {
        setIsRoute(true);
    }

    // -------------------------------Funciones Sobre las Rutas-------------------------------
    const router = useRouter();
    const { id } = router.query;
    // Si id es un string[] (array), seleccionamos el primer elemento como id
    const selectedId = Array.isArray(id) ? id[0] : id;
    // Validar que selectedId no sea undefined y proporcionar un valor predeterminado (puedes usar una cadena vacía o algún otro valor)
    const organizationID = selectedId !== undefined ? selectedId : '';

    const [selectedMarker1, setSelectedMarker1] = useState<number>(-1);
    const [selectedMarker2, setSelectedMarker2] = useState<number>(-1);
    const [items, setItems] = useState<RouteData[]>([]);

    const [newItem, setNewItem] = useState<RouteData>({
        id: 0,
        Name: '',
        UbicationI: '',
        latitude1: 0,
        longitude1: 0,
        UbicationF: '',
        latitude2: 0,
        longitude2: 0,

        vehicleHasTripID: 0,
        vehicleID: 0,
        tripID: 0,
        userHasprofileID: 0,
        dateAssignment: new Date(),
        typeBurdenID: 0,
        status: '',
        dateAssignmentF: new Date(),

        userID: 0,
        profileID: 0,
        weight: 0,
        typeBurden: '',
        patent: '',
        mark: '',
        model: '',
        maxWeight: 0,
        diferenceWeight: 0,
        distanceTravelInitial: 0,
        distanceTravelFinal: 0
    });

    const [updateId, setUpdateId] = useState<number | null>(null);
    const [selectEdit, setSelectEdit] = useState<string>('');
    const [selectedRoutes, setSelectedRoutes] = useState<RouteData[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const isValidSelection = (selectedMarker1: number | null, selectedMarker2: number | null, markers: MarkerData[]) => {
        if (selectedMarker1 === null || selectedMarker2 === null || selectedMarker1 === selectedMarker2) {
            console.log('Debe seleccionar dos marcadores válidos.');
            return false;
        }

        const marker1Data = markers[selectedMarker1];
        const marker2Data = markers[selectedMarker2];

        if (!marker1Data || !marker2Data) {
            console.log('Los datos de los marcadores seleccionados no son válidos.');
            return false;
        }

        return true;
    };

    const isValidSelectionUpdate = (
        selectedMarker1: number | null,
        selectedMarker2: number | null,
        markers: MarkerData[],
        access_token: any
    ) => {
        if (selectedMarker1 === null || selectedMarker2 === null) {
            console.log('Debe seleccionar dos marcadores válidos.');
            return null;
        }

        if (selectedMarker1 === -1 && selectedMarker2 === -1) {
            const config = {
                tripID: updateId,
                organizationID: id,
                Name: newItem.Name,
                access_token: access_token,
                UbicationI: newItem.UbicationI,
                latitude1: newItem.latitude1,
                longitude1: newItem.longitude1,
                UbicationF: newItem.UbicationF,
                latitude2: newItem.latitude2,
                longitude2: newItem.longitude2,
            };

            return config;
        } else if (selectedMarker1 === -1 && selectedMarker2 !== -1) {
            const marker2Data = markers[selectedMarker2];
            const config = {
                tripID: updateId,
                organizationID: id,
                Name: newItem.Name,
                access_token: access_token,
                UbicationI: newItem.UbicationI,
                UbicationF: marker2Data?.name,
            };

            return config;
        } else if (selectedMarker2 === -1 && selectedMarker1 !== -1) {
            const marker1Data = markers[selectedMarker1];
            const config = {
                tripID: updateId,
                organizationID: id,
                Name: newItem.Name,
                access_token: access_token,
                UbicationI: marker1Data?.name,
                UbicationF: newItem.UbicationF,
            };

            return config;
        } else {
            return null;
        }
    };

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
        // Verificar si se han realizado selecciones válidas
        if (!isValidSelection(selectedMarker1, selectedMarker2, markers)) {
            return;
        }

        // Obtener los datos de los marcadores seleccionados
        const marker1Data = markers[selectedMarker1];
        const marker2Data = markers[selectedMarker2];

        // Check if marker1Data and marker2Data are defined before proceeding
        if (!marker1Data || !marker2Data) {
            console.log('Los datos de los marcadores seleccionados no son válidos.');
            return;
        }

        try {
            const url = urls[1] || '';
            // Crea una nueva objeto RouteData con el formulario y las marcas selecionadas
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const Item = {
                    access_token: access_token,
                    organizationID: id,
                    UbicationI: marker1Data.name,
                    UbicationF: marker2Data.name,
                    dateAssignment: `${newItem.dateAssignment.getFullYear()}-${(newItem.dateAssignment.getMonth() + 1).toString().padStart(2, '0')}-${newItem.dateAssignment.getDate().toString().padStart(2, '0')}`,
                    vehicleID: vehiculeID,
                    userHasprofileID: profileID,
                    Name: newItem.Name,
                    weight: newItem.weight,
                    typeBurden: newItem.typeBurden,
                }
                const response = await CreateRequest(url, Item);
                OptionMessage(response);
            }
            else {
                setMessageError("Expiro la Session")
            }

        } catch (error) {
            setMessageError(`Error creating ${itemName}:` + (error as Error).message);
        }
    };

    const handleUpdateRoutes = async () => {
        if (updateId === null) return;

        try {

            const url = urls[2] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = isValidSelectionUpdate(selectedMarker1, selectedMarker2, markers, access_token);
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

    const handleUpdateTypeBurden = async () => {
        if (updateId === null) return;

        try {

            const url = urls[3] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {

                const config = {
                    access_token: access_token,
                    organizationID: id,
                    typeBurdenID: newItem.typeBurdenID,
                    weight: newItem.weight,
                    typeBurden: newItem.typeBurden
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

    const handleUpdateData = async () => {
        if (updateId === null) return;

        try {
            const url = urls[4] || '';
            const access_token = localStorage.getItem('access_token_Request');

            if (access_token) {
                let vehicleID_AUX = vehiculeID;
                let profileID_AUX = profileID;

                if (vehicleID_AUX === -1) {
                    vehicleID_AUX = newItem.vehicleID;
                }
                if (profileID_AUX === -1) {
                    profileID_AUX = newItem.userHasprofileID;
                }

                const config = {
                    access_token: access_token,
                    organizationID: id,
                    vehicleHasTripID: newItem.vehicleHasTripID,
                    vehicleID: vehicleID_AUX,
                    userHasprofileID: profileID_AUX
                };

                const response = await UpdateRequest(url, config);
                OptionMessage(response);
            } else {
                setMessageError("Expiró la sesión");
            }
        } catch (error) {
            setMessageError(`Error updating ${itemName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleDeleteSelectedRoutes = async () => {
        try {
            const url = urls[5] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                for (const item of selectedRoutes) {
                    const config = {
                        access_token: access_token,
                        organizationID: id,
                        tripID: item.tripID,
                        typeBurdenID: item.typeBurdenID
                    };
                    const response = await DeleteRequest(url, config);
                    OptionMessage(response);
                }
            } else {
                setMessageError("Expiró la sesión");
            }
        } catch (error) {
            setMessageError(`Error deleting ${itemName}:` + (error as Error).message);
        }
    };

    const handleCheckboxChangeRoutes = (event: React.ChangeEvent<HTMLInputElement>, item: RouteData) => {
        if (event.target.checked) {
            setSelectedRoutes((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedRoutes(prevSelectedItems =>
                prevSelectedItems.filter(selectedItem => selectedItem.id !== item.id)
            );
        }
    };

    const handleMasterCheckboxChangeRoutes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectAll(event.target.checked);
        setSelectedRoutes(event.target.checked ? items : []);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (updateId !== null) {
            if (selectEdit === 'Ruta') {
                await handleUpdateRoutes();
            }
            else if (selectEdit === 'Carga') {
                await handleUpdateTypeBurden();
            }
            else {
                await handleUpdateData();
            }
        } else {
            await handleCreate();
        }
    };

    const handleEdit = (item: RouteData, editValue: string) => {
        setSelectEdit(editValue);
        setUpdateId(item.id);
        setNewItem({
            id: item.id,
            Name: item.Name,
            UbicationI: item.UbicationI,
            latitude1: item.latitude1,
            longitude1: item.longitude1,
            UbicationF: item.UbicationF,
            latitude2: item.latitude2,
            longitude2: item.longitude2,

            vehicleHasTripID: item.vehicleHasTripID,
            vehicleID: item.vehicleID,
            tripID: item.tripID,
            userHasprofileID: item.userHasprofileID,
            dateAssignment: item.dateAssignment,
            typeBurdenID: item.typeBurdenID,
            status: item.status,
            dateAssignmentF: item.dateAssignmentF,

            userID: item.userID,
            profileID: item.profileID,
            weight: item.weight,
            typeBurden: item.typeBurden,
            patent: item.patent,
            mark: item.mark,
            model: item.model,
            maxWeight: item.maxWeight,
            diferenceWeight: item.diferenceWeight,
            distanceTravelInitial: item.distanceTravelInitial,
            distanceTravelFinal: item.distanceTravelFinal
        });

        openLoginModal();
    };

    const clearItem = () => {
        setUpdateId(null);
        setNewItem({
            id: 0,
            Name: '',
            UbicationI: '',
            latitude1: 0,
            longitude1: 0,
            UbicationF: '',
            latitude2: 0,
            longitude2: 0,
            vehicleHasTripID: 0,
            vehicleID: 0,
            tripID: 0,
            userHasprofileID: 0,
            dateAssignment: new Date(),
            typeBurdenID: 0,
            status: '',
            dateAssignmentF: new Date(),

            userID: 0,
            profileID: 0,
            weight: 0,
            typeBurden: '',
            patent: '',
            mark: '',
            model: '',
            maxWeight: 0,
            diferenceWeight: 0,
            distanceTravelInitial: 0,
            distanceTravelFinal: 0
        });
        setSelectedMarker1(-1);
        setSelectedMarker2(-1);
        setProfileID(-1);
        setVehiculeID(-1);
        setSelectEdit('');
    }

    const clearCheckbox = () => {
        setSelectedRoutes([]);
        setSelectAll(false);
    }

    const OptionMessage = (data: any): void => {
        if (data.error) {
            if (data.error.message) {
                setMessageError(data.message);
                return;
            }
            setMessageError(data.error);
        }
        else if (data.message) {
            if (data.message == "Se creó el viaje" ||
                data.message == "se ha actualizado los datos del viaje exitosamente" ||
                data.message == "El viaje se eliminó exitosamente" ||
                data.message == "se ha actualizado los datos del viaje exitosamente" ||
                data.message == "Datos de carga del viaje actualizados exitosamente" ||
                data.message == "Se ha actualizado los datos exitosamente"
            ) {
                setMessageVerification(data.message);
                fetchItems();
                closeModal();
                return;
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
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const [searchType, setSearchType] = useState<'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden' | 'maxWeight' | 'diferenceWeight' | 'distanceTravelInitial' | 'distanceTravelFinal'>('id');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [sortProperty, setSortProperty] = useState<'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden' | 'maxWeight' | 'diferenceWeight' | 'distanceTravelInitial' | 'distanceTravelFinal'>('id');

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

    const handleSortPropertyChange = (property: 'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden' | 'maxWeight' | 'diferenceWeight' | 'distanceTravelInitial' | 'distanceTravelFinal') => {
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

    // -------------------------------Funciones para los Modal-------------------------------
    // // Variables del Componente Modal
    const [ModalOpen, setModalOpen] = useState(false);

    // Funciones que activa el modal para loguearse
    const openLoginModal = () => {
        setModalOpen(true);
        fetchProfiles();
        fetchVehicules();
    };

    // Funcion que cierra el modal para loguearse
    const closeModal = () => {
        setModalOpen(false);
        clearItem();
    };

    // -------------------------------Funciones para los ComboBoxes-------------------------------
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [profileID, setProfileID] = useState<number>(-1);

    const fetchProfiles = async () => {
        try {
            const url = urls[7] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const config = {
                    access_token: access_token,
                    organizationID: id,
                };

                const response = await ReadRequest(url, config);
                if (!response.error && !response.errors) {
                    if (!response.message) {
                        setProfiles(response);
                    }
                }
            }
        } catch (error) {
            setProfiles([])
        }
    };

    const [vehicules, setVehicules] = useState<Vehicule[]>([]);
    const [vehiculeID, setVehiculeID] = useState<number>(-1);

    const fetchVehicules = async () => {
        try {
            const url = urls[8] || '';
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const config = {
                    access_token: access_token,
                    organizationID: id,
                };

                const response = await ReadRequest(url, config);
                if (!response.error && !response.errors) {
                    if (!response.message) {
                        setVehicules(response);
                    }
                }
            }
        } catch (error) {
            setVehicules([])
        }
    };

    return (
        <>
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

            <ModalCRUD isOpen={ModalOpen}>
                <FormContainer updateId={updateId} itemName={itemName} h2Text={``} pText={''} handleSubmit={handleSubmit} closeModal={closeModal}>

                    {(selectEdit === 'Ruta' || selectEdit === '') && (
                        <>
                            <TextInput
                                value={newItem.Name}
                                onChange={(e) => setNewItem({ ...newItem, Name: e.target.value })}
                                placeholder="Ingresar Nombre"
                            />

                            <div className="relative flex items-center">
                                <select
                                    id="marker1"
                                    className="w-full h-10 rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                    value={selectedMarker1}
                                    onChange={(e) => setSelectedMarker1(Number(e.target.value))}
                                >
                                    <option value="-1">Seleccione un Inicio</option>
                                    {markers.map((item, index) => (
                                        <option key={index} value={index}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative flex items-center">
                                <select
                                    id="marker2"
                                    className="w-full h-10 rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                                    value={selectedMarker2}
                                    onChange={(e) => setSelectedMarker2(Number(e.target.value))}
                                >
                                    <option value="-1">Seleccione un Final</option>
                                    {markers.map((item, index) => (
                                        <option key={index} value={index}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {(selectEdit === 'Datos' || selectEdit === '') && (
                        <>
                            <SearchProfileIDSelect items={profiles} setItemID={setProfileID} />
                            <SearchVehiculeIDSelect items={vehicules} setItemID={setVehiculeID} />
                        </>
                    )}

                    {(selectEdit === 'Carga' || selectEdit === '') && (
                        <>
                            <TextInput
                                value={newItem.typeBurden}
                                onChange={(e) => setNewItem({ ...newItem, typeBurden: e.target.value })}
                                placeholder="Ingresar el Tipo de Carga"
                            />
                            <NumberInput
                                value={newItem.weight}
                                onChange={(value) => setNewItem({ ...newItem, weight: value })}
                                placeholder="Ingresar Peso de la Carga"
                            />
                        </>
                    )}
                </FormContainer>
            </ModalCRUD>

            <div className='min-h-screen mx-6 my-2'>

                <div className="flex flex-col items-center gap-2  mb-4">
                    <div className='text-center'>
                        <h1 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-gray-900">
                            {title}
                        </h1>
                        <p className="text-md sm:text-sm font-medium text-gray-500">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <section>
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                            <div className="flex-1 w-full md:w-1/2">
                                <CustomMap
                                    markers={markers}
                                    selectedMarkers={selectedMarkers}
                                    center={center}
                                    handleMapClick={handleMapClick}
                                />
                            </div>
                        </LoadScript>
                    </div>
                </section>

                <nav aria-label="Breadcrumb" className="flex justify-center mt-1 mb-2 sm:mb-4">
                    <ol className="flex w-full overflow-hidden rounded-lg border border-gray-200 text-gray-600">
                        <li className="flex-1">
                            <button onClick={handleIsMarker} type="button"
                                className="flex w-full h-10 items-center justify-center  gap-1.5 bg-white px-4 transition hover:text-indigo-600 hover:bg-gray-100"
                            >
                                <span className="ms-1.5 text-xs font-medium"> Marcas </span>
                            </button>
                        </li>

                        <li className="flex-1">
                            <button onClick={handleIsRoute} type="button"
                                className="flex w-full h-10 items-center justify-center  bg-white px-6 text-xs font-medium transition hover:text-indigo-600 hover:bg-gray-100"
                            >
                                <span className="ms-1.5 text-xs font-medium"> Rutas </span>
                            </button>
                        </li>
                    </ol>
                </nav>

                {!isRoute ? (
                    <div className='flex justify-center gap-1 sm:gap-2 mt-2'>
                        <div className="w-80 sm:w-42">
                            <CustomButton onClick={handleDelete} type="button"
                                color="red"
                                padding_x="0"
                                padding_smx="0"
                                padding_mdx="0"
                                padding_y="2.5"
                                width="full"
                                height="10"
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
                                Eliminar Marca
                            </CustomButton>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <div className='flex justify-center gap-2 my-2'>
                                <div className='w-80 sm:w-96 md:w-52'>
                                    <CustomButton type="button" onClick={openLoginModal}
                                        color="indigo"
                                        padding_x="0"
                                        padding_smx="0"
                                        padding_mdx="0"
                                        padding_y="2"
                                        width="full"
                                        height="10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Crear {itemName}
                                    </CustomButton>
                                </div>
                                <div className='w-20'>
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
                                    </CustomButton>
                                </div>
                                <div className='w-80 sm:w-96 md:w-52'>
                                    <CustomButton type="button" onClick={handleDeleteSelectedRoutes}
                                        color="red"
                                        padding_x="0"
                                        padding_smx="0"
                                        padding_mdx="0"
                                        padding_y="2"
                                        width="full"
                                        height="10"
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
                                        'id' | 'Name' | 'UbicationI' | 'UbicationF' | 'dateAssignment' | 'dateAssignmentF' | 'status' | 'userID' | 'userHasprofileID' | 'vehicleID' | 'mark' | 'patent' | 'model' | 'weight' | 'typeBurdenID' | 'typeBurden' | 'maxWeight' | 'diferenceWeight' | 'distanceTravelInitial' | 'distanceTravelFinal')}
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
                                    <option value="maxWeight">Maximo Peso del Vehiculo</option>
                                    <option value="typeBurdenID">ID de la Carga</option>
                                    <option value="typeBurden">Nombre de la Carga</option>
                                    <option value="weight">Peso de la Carga</option>
                                    <option value="diferenceWeight">Diferencia de Peso</option>
                                    <option value="distanceTravelInitial">Distancia Inicial</option>
                                    <option value="distanceTravelFinal">Diferencia Final</option>

                                </select>
                            </SearchComponent>
                        </div>
                    </>
                )}

                <section>
                    <div className="flex flex-col items-center gap-2 md:flex-row mb-10">
                        {!isRoute ? (
                            <div className="flex w-full gap-2 flex flex-col justify-center items-center">
                                <div className="max-h-80 gap-2 w-full overflow-x-auto">

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

                            </div>
                        ) : (
                            <>
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
                                                                Distancia Inical
                                                                <button onClick={() => handleSortPropertyChange('distanceTravelInitial')}>

                                                                    {sortProperty === 'distanceTravelInitial' ? (
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
                                                                Distancia Final
                                                                <button onClick={() => handleSortPropertyChange('distanceTravelFinal')}>

                                                                    {sortProperty === 'distanceTravelFinal' ? (
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
                                                                <button onClick={() => handleSortPropertyChange('maxWeight')}>

                                                                    {sortProperty === 'maxWeight' ? (
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
                                                    <th>
                                                        <div className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                            <div className='flex items-center gap-1'>
                                                                Diferencia de Peso
                                                                <button onClick={() => handleSortPropertyChange('diferenceWeight')}>

                                                                    {sortProperty === 'diferenceWeight' ? (
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
                                                            Acciones
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {getCurrentPageItems().map(item => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-2">
                                                            <input type="checkbox" checked={selectedRoutes.includes(item)} onChange={(event) => handleCheckboxChangeRoutes(event, item)} />
                                                        </td>
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
                                                            {item.distanceTravelInitial}
                                                        </td>
                                                        <td className="text-gray-600 text-center whitespace-nowrap px-4 py-2 font-medium">
                                                            {item.distanceTravelFinal}
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
                                                            {item.maxWeight}
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
                                                        <td className="text-center whitespace-nowrap px-4 py-2">
                                                            {item.diferenceWeight >= 0 ? (
                                                                <span className='text-green-500 font-semibold'>{item.diferenceWeight}</span>
                                                            ) : (
                                                                <span className='text-red-500 font-semibold'>{item.diferenceWeight}</span>
                                                            )}
                                                        </td>
                                                        <td className="flex justify-center items-center space-x-4 px-4 py-2">
                                                            <CustomButton onClick={() => handleEdit(item, 'Ruta')} type="button"
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
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                    />
                                                                </svg>
                                                                Editar Ruta
                                                            </CustomButton>
                                                            <CustomButton onClick={() => handleEdit(item, 'Carga')} type="button"
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
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                    />
                                                                </svg>
                                                                Editar Carga
                                                            </CustomButton>
                                                            <CustomButton onClick={() => handleEdit(item, 'Datos')} type="button"
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
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                    />
                                                                </svg>
                                                                Editar Datos
                                                            </CustomButton>
                                                            <Link href={`/${urls[6]}/Map/${item.vehicleHasTripID}?name=${encodeURIComponent(item.Name)}&organizationID=${encodeURIComponent(organizationID)}`}>
                                                                <CustomButton type="button"
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
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                                                                    </svg>
                                                                    Ver Ruta
                                                                </CustomButton>
                                                            </Link>
                                                            <Link href={`/${urls[6]}/Recharge/${item.vehicleHasTripID}?name=${encodeURIComponent(item.Name)}&organizationID=${encodeURIComponent(organizationID)}`}>
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
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <PaginationButtons currentPage={currentPage} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage} />
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div >
        </>
    );
};

export default MapCRUD;