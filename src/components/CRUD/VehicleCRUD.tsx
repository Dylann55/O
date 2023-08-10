import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';
import NumberInput from '../Widgets/Imput/NumberInput';

import { CreateRequest, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';
import { filterItems, sortItems } from '@/utils/SearchFilter';
import ItemListHeader from '../Widgets/ItemListHeader';
import SearchComponent from '../Search/SearchComponent';
import PaginationButtons from './PaginationButtons';
import FormContainer from './Form/FormContainer';
import TextInput from '../Widgets/Imput/TextInput';

interface Item {
  vehicleID: number;
  patent: string;
  mark: string;
  model: string;
  maxWeight: number;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

interface VehicleCRUDProps {
  urls: string[];
  title: string;
  subtitle: string;
}

const VehicleCRUD: React.FC<VehicleCRUDProps> = ({ urls, title, subtitle }) => {

  const [itemName] = useState<string>('Vehiculos');
  const router = useRouter();
  const { id, name } = router.query;

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    vehicleID: 0,
    patent: '',
    mark: '',
    model: '',
    maxWeight: 0,
  });

  const [updateId, setUpdateId] = useState<number | null>(null);
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

      if (access_token) {
        const Item = { ...newItem, access_token: access_token, organizationID: id };
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

  const handleUpdate = async () => {
    if (updateId === null) return;

    try {

      const url = urls[2] || '';
      const access_token = localStorage.getItem('access_token_Request');
      if (access_token) {

        const config = {
          vehicleID: updateId,
          patent: newItem.patent,
          access_token: access_token,
          mark: newItem.mark,
          model: newItem.model,
          maxWeight: newItem.maxWeight,
          organizationID: id,
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
        const idsToDelete = selectedItems.map(item => item.vehicleID);
        for (const idToDelete of idsToDelete) {
          const config = {
            access_token: access_token,
            vehicleID: idToDelete,
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (updateId !== null) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleEdit = (item: Item) => {
    setUpdateId(item.vehicleID);
    setNewItem({
      vehicleID: item.vehicleID,
      patent: item.patent,
      mark: item.mark,
      model: item.model,
      maxWeight: item.maxWeight,
    });
    openLoginModal();
  };

  const clearItem = () => {
    setUpdateId(null);
    setNewItem({
      vehicleID: 0,
      patent: '',
      mark: '',
      model: '',
      maxWeight: 0,
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
        prevSelectedItems.filter(selectedItem => selectedItem.vehicleID !== item.vehicleID)
      );
    }
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked);
    setSelectedItems(event.target.checked ? items : []);
  };

  const OptionMessage = (data: any): void => {
    if (data.error) {
      setMessageError(data.error);
    }
    else if (data.message) {
      if (data.message == "Se actualizaron los datos del transporte" ||
        data.message == "Se ha eliminado el transporte exitosamente" ||
        data.message == "Se eliminó exitosamente" ||
        data.message == "se ha agregado el transporte a la empresa exitosamente" ||
        data.message == "El transporte se creo exitosamente" ||
        data.message == "Se actualizó el transporte exitosamente"
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
  const [searchType, setSearchType] = useState<'vehicleID' | 'patent' | 'mark' | 'model' | 'maxWeight'>('vehicleID');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortProperty, setSortProperty] = useState<'vehicleID' | 'patent' | 'mark' | 'model' | 'maxWeight'>('vehicleID');


  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
    const filteredItems = filterItems(items, searchTerm, searchType);

    // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
    const sortedItems = sortItems(filteredItems, sortProperty, sortDirection);

    return sortedItems.slice(startIndex, endIndex);
  };

  const handleSortPropertyChange = (property: 'vehicleID' | 'patent' | 'mark' | 'model' | 'maxWeight') => {
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

  return (
    <div>

      {messageError && (
        <Alert message={messageError} onClose={closeAlert} />
      )}
      {messageVerification && (
        <AlertVerification message={messageVerification} onClose={closeAlert} />
      )}

      <ModalCRUD isOpen={ModalOpen}>
        <FormContainer updateId={updateId} itemName={itemName} h2Text={`Creacion de Vehiculos para ${name}`} pText={''} handleSubmit={handleSubmit} closeModal={closeModal}>
          <TextInput
            value={newItem.patent}
            onChange={(e) => setNewItem({ ...newItem, patent: e.target.value })}
            placeholder="Ingresar Patente del Vehiculo"
          />
          <TextInput
            value={newItem.mark}
            onChange={(e) => setNewItem({ ...newItem, mark: e.target.value })}
            placeholder="Ingresar Marca del Vehiculo"
          />
          <TextInput
            value={newItem.model}
            onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
            placeholder="Ingresar Modelo del Vehiculo"
          />
          <NumberInput
            value={newItem.maxWeight}
            onChange={(value) => setNewItem({ ...newItem, maxWeight: value })}
            placeholder="Ingresar Peso Máximo del Vehículo (Kilos)"
          />
        </FormContainer>
      </ModalCRUD>

      <div className='min-h-screen mx-6 my-2'>

        <ItemListHeader title={title} subtitle={subtitle} itemName={itemName} openLoginModal={openLoginModal} fetchItems={fetchItems} handleDeleteSelected={handleDeleteSelected} />

        <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
          <select
            className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'vehicleID' | 'patent' | 'mark' | 'model' | 'maxWeight')}
          >
            <option value="vehicleID">ID de la {itemName}</option>
            <option value="mark">Marca del {itemName}</option>
            <option value="patent">Patente del {itemName}</option>
            <option value="model">Modelo del {itemName}</option>
            <option value="maxWeight">Peso Maximo del {itemName}</option>
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
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  <div className='flex items-center gap-1'>
                    Marca del {itemName}
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
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  <div className='flex items-center gap-1'>
                    Patente del {itemName}
                    <button onClick={() => handleSortPropertyChange('patent')}>

                      {sortProperty === 'patent' ? (
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
                    Modelo del {itemName}
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
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  <div className='flex items-center gap-1'>
                    Maximo Peso del {itemName}
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
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Metodos
                </th>

              </tr>
            </thead>

            <tbody className="divide-y text-gray-600 ">
              {getCurrentPageItems().map(item => (

                <tr key={item.vehicleID}>

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
                    {item.vehicleID}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 font-medium">
                    {item.mark}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 font-medium">
                    {item.patent}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 font-medium">
                    {item.model}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 font-medium">
                    {item.maxWeight}
                  </td>

                  <td className="px-4 py-2">

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

export default VehicleCRUD;
