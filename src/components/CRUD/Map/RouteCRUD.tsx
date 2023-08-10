import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';

import Alert from '@/components/Widgets/Alert';
import AlertVerification from '@/components/Widgets/AlertVerification';

import CustomButton from '@/components/Widgets/Button/CustomButton';
import GoogleMapComponent from '@/components/Map/GoogleMap';
import GeolocationTracker from '@/components/Map/GeolocationTracker';
import { CreateRequest } from '@/utils/CRUD';
import ModalCRUD from '@/components/Widgets/ModalCRUD';
import NumberInput from '@/components/Widgets/Imput/NumberInput';

interface Position {
    latitude: number;
    longitude: number;
    dateHour: Date;
    vehicleHasTripID: number;
}

interface RouteCRUDProps {
    urls: string[];
    title: string;
    subtitle: string;
}

const RouteCRUD: React.FC<RouteCRUDProps> = ({ urls, title, subtitle }) => {

    const router = useRouter();
    const { id, organizationID } = router.query;
    const [itemName] = useState<string>('Ruta');
    const [distance, setDistance] = useState<number>(0);

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

    // -------------------------------Funciones de Seguimiento-------------------------------
    const [trackingEnabled, setTrackingEnabled] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);

    useEffect(() => {
        // Load tracking status from localStorage on component mount
        const savedTrackingStatus = localStorage.getItem('trackingEnabled');
        setTrackingEnabled(savedTrackingStatus === 'true');

        // Load positions from localStorage on component mount
        const savedPositions = localStorage.getItem('positions');
        if (savedPositions) {
            setPositions(JSON.parse(savedPositions));
        }
    }, []);

    const handleStartTracking = () => {
        const savedPositions = localStorage.getItem('positions');

        if (!savedPositions || savedPositions.length === 2) {
            handleCreateStart();
        }

        // Load positions from localStorage on component mount
        if (savedPositions) {
            setPositions(JSON.parse(savedPositions));
        }
    };

    const handleStopTracking = () => {
        //localStorage.setItem('positions', JSON.stringify(positions));
        // Clear the positions array
        handleCreateStop();
    };

    const handleCreateStart = async () => {
        try {
            const url = urls[0] || '';
            // Crea una nueva objeto RouteData con el formulario y las marcas selecionadas
            const access_token = localStorage.getItem('access_token_Request');
            if (access_token) {
                const Item = {
                    access_token: access_token,
                    organizationID: organizationID,
                    vehicleHasTripID: id,
                    distanceTravelInitial: distance
                };
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

    const handleCreateStop = async () => {
        try {
            const url = urls[1] || '';
            // Crea una nueva objeto RouteData con el formulario y las marcas selecionadas
            const access_token = localStorage.getItem('access_token_Request');
            const date_Finish = new Date();
            if (access_token) {
                const Item = {
                    access_token: access_token,
                    organizationID: organizationID,
                    vehicleHasTripID: id,
                    locations: positions,
                    distanceTravelFinal: distance,
                    dateAssignmentF: `${date_Finish.getFullYear()}-${(date_Finish.getMonth() + 1).toString().padStart(2, '0')}-${date_Finish.getDate().toString().padStart(2, '0')}`,

                };
                console.log(Item);
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

    const OptionMessage = (data: any): void => {
        console.log(data)
        if (data.error) {
            if (data.error.message) {
                setMessageError(data.message);
                return;
            }
            setMessageError(data.error);
        }
        else if (data.message) {
            if (data.message == "El viaje se ha iniciado exitosamente" ||
                data.message == "Viaje finalizado exitosamente"
            ) {
                setMessageVerification(data.message);
                if (data.message == "Viaje finalizado exitosamente") {
                    setTrackingEnabled(false);
                    setPositions([]);
                    localStorage.setItem('trackingEnabled', 'false');
                    localStorage.setItem('positions', JSON.stringify([]))
                    Router.push('/Transport/MyParticipation');
                }
                if (data.message == "El viaje se ha iniciado exitosamente") {
                    setTrackingEnabled(true);
                    localStorage.setItem("vehicleHasTripID", typeof id === 'string' ? id : '');
                    localStorage.setItem('trackingEnabled', 'true');
                    closeModalInicial();
                }
                return;
            }
            else if (data.message == "El viaje ya habia iniciado" ||
                data.message == "El chofer no tiene relación con el viaje" ||
                data.message == "El viaje no esta en curso") {
                setMessageError(data.message);
                Router.push('/Transport/MyParticipation');
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

    // -------------------------------Funciones para los Modal-------------------------------
    // // Variables del Componente Modal
    const [ModalOpen, setModalOpen] = useState(false);

    // Funciones que activa el modal para loguearse
    const openLoginModal = () => {
        setModalOpen(true);
    };
    // Funcion que cierra el modal para loguearse
    const closeModal = () => {
        setModalOpen(false);
    };

    // // Variables del Componente Modal
    const [ModalOpenInicial, setModalOpenInicial] = useState(false);

    // Funciones que activa el modal para loguearse
    const openLoginModalInicial = () => {
        setModalOpenInicial(true);
    };
    // Funcion que cierra el modal para loguearse
    const closeModalInicial = () => {
        setModalOpenInicial(false);
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
                <div className="mx-auto max-w-screen items-center">
                    <div className="mb-0 space-y-4 rounded-lg p-4 sm:p-6">
                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Verificacion
                            </h1>

                            <p className="mx-auto mt-4 max-w-md text-center text-sm text-gray-500">
                                Una vez que se complete el seguimiento, se aplicarán las siguientes acciones:
                                <br />
                                - No se permitirá el acceso futuro a esta página.
                                <br />
                                - No se podrá acceder al CRUD de Recargas.
                                <br />
                                - El estado de la Ruta cambiará a "Finalizado".
                                <br />
                            </p>
                        </div>

                        <NumberInput
                            value={distance}
                            onChange={(value) => setDistance(value)}
                            placeholder="Ingresar Distancia Inicial"
                        />

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                            <div className="flex-1 w-96 sm:w-52">
                                <CustomButton onClick={handleStopTracking} type="button"
                                    color="indigo"
                                    padding_x="0"
                                    padding_smx="0"
                                    padding_mdx="0"
                                    padding_y="2.5"
                                    width="full"
                                    height="10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                    Detener Seguimiento
                                </CustomButton>

                            </div>
                            <div className="flex-1 w-96 sm:w-52">
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
                    </div>
                </div>
            </ModalCRUD>

            <ModalCRUD isOpen={ModalOpenInicial}>
                <div className="mx-auto max-w-screen items-center">
                    <div className="mb-0 space-y-4 rounded-lg p-4 sm:p-6">
                        <div className="mx-auto max-w-lg text-center">
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Inicio de Seguimiento
                            </h1>

                            <p className="mx-auto mt-4 max-w-md text-center text-sm text-gray-500">
                                Una vez que inicie el seguimiento, se aplicarán las siguientes acciones:
                                <br />
                                - Antes de Iniciar verifique que el mapa este cargado.
                                <br />
                                - Si se recarga la pagina los marcadores quedaran guardados.
                                <br />
                                - El estado de la Ruta cambiará a "En Proceso".
                                <br />
                            </p>
                        </div>

                        <NumberInput
                            value={distance}
                            onChange={(value) => setDistance(value)}
                            placeholder="Ingresar Distancia Final"
                        />

                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                            <div className="flex-1 w-96 sm:w-52">
                                <CustomButton onClick={handleStartTracking} type="button"
                                    color="indigo"
                                    padding_x="0"
                                    padding_smx="0"
                                    padding_mdx="0"
                                    padding_y="2.5"
                                    width="full"
                                    height="10"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                    Iniciar Seguimiento
                                </CustomButton>

                            </div>
                            <div className="flex-1 w-96 sm:w-52">
                                <CustomButton onClick={closeModalInicial} type="button"
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
                    </div>
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
                    <div className='flex items-center w-full md:w-52'>
                        {trackingEnabled ? (
                            <CustomButton type="button" onClick={openLoginModal}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Detener seguimiento
                            </CustomButton>
                        ) : (
                            <CustomButton type="button" onClick={openLoginModalInicial}
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
                                {positions.length > 0 ? 'Reanudar seguimiento' : 'Iniciar seguimiento'}
                            </CustomButton>
                        )}
                    </div>
                </div>
                <section>
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                        <GoogleMapComponent positions={positions} />
                    </div>
                </section>
                {trackingEnabled && (
                    <GeolocationTracker positions={positions} setPositions={setPositions} />
                )}
            </div >
        </>
    );
};

export default RouteCRUD;