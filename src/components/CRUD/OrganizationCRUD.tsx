import React, { useState, useEffect } from 'react';

import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';

import { CreateRequest, DeleteRequest, ReadRequest, UpdateRequest } from '@/utils/CRUD';
import CustomButton from '../Widgets/Button/CustomButton';
import { getSession } from '@/utils/LocalStorage';
import Link from 'next/link';
import FormContainer from './Form/FormContainer';
import TextInput from '../Widgets/Imput/TextInput';
import ItemListHeader from '../Widgets/ItemListHeader';
import PaginationButtons from './PaginationButtons';
import { filterItems, sortItems } from '@/utils/SearchFilter';
import SearchComponent from '../Search/SearchComponent';

interface Item {
  organizationID: number;
  name: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

interface OrganizationCRUDProps {
  urls: string[];
  title: string;
  subtitle: string;
}

const OrganizationCRUD: React.FC<OrganizationCRUDProps> = ({ urls, title, subtitle }) => {

  const [itemName] = useState<string>('Organizacion');

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    organizationID: 0,
    name: '',
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
        }
        const response = await ReadRequest(url, config);
        if (response.data && Array.isArray(response.data) && !response.errors && !response.error) {
          // Formato 1: La respuesta tiene una propiedad "data" que es un array
          const organizations = response.data.map((item: { organization: any }) => item.organization);
          setItems(organizations);
          clearCheckbox();

        } else if (!response.data && !response.errors && !response.error) {
          // Formato 2: La respuesta tiene una propiedad "organization" directamente
          setItems(response);
          clearCheckbox();

        } else {
          if (response.errors) {
            setMessageError(response.errors.data.errors[0].msg)
          }
          setMessageError(response.error.message);
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
        const Item = { ...newItem, access_token: access_token };
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
          organizationID: updateId,
          name: newItem.name,
          access_token: access_token,
        }
        const response = await UpdateRequest(url, config);
        OptionMessageUD(response);
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
        const idsToDelete = selectedItems.map(item => item.organizationID);
        for (const idToDelete of idsToDelete) {
          const config = {
            access_token: access_token,
            organizationID: idToDelete,
          }
          console.log(config);
          const response = await DeleteRequest(url, config);
          console.log(response);
          OptionMessageUD(response);
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
    setUpdateId(item.organizationID);
    setNewItem({
      organizationID: item.organizationID,
      name: item.name,
    });
    openLoginModal();
  };

  const clearItem = () => {
    setUpdateId(null);
    setNewItem({
      organizationID: 0,
      name: '',
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
        prevSelectedItems.filter(selectedItem => selectedItem.organizationID !== item.organizationID)
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
    } else if (data.message) {
      if (data.message == "La empresa se creó exitosamente" || data.message == "La empresa se creo exitosamente") {
        setMessageVerification(data.message);
        fetchItems();
        closeModal();
        return;
      }
      setMessageError(data.message);
    } else if (data.errors) {
      setMessageError(data.errors[0].msg);
    } else if (data) {
      setMessageVerification(data);
      fetchItems();
      closeModal();
    } else {
      setMessageError('Error Inesperado');
    }
  };

  const OptionMessageUD = (data: any): void => {
    if (data.error) {
      setMessageError(data.error);
    }
    else if (data.message) {
      if (data.message == "El nombre se actualizo exitosamente" ||
        data.message == "Se eliminó la empresa" ||
        data.message == "Se actualizo exitosamente" ||
        data.message == "Se eliminó exitosamente") {
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
  const [searchType, setSearchType] = useState<'organizationID' | 'name'>('organizationID');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortProperty, setSortProperty] = useState<'organizationID' | 'name'>('organizationID');

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Filtrar y ordenar los elementos según el término de búsqueda y el tipo de búsqueda seleccionado
    const filteredItems = filterItems(items, searchTerm, searchType);

    // Ordenar los elementos según la dirección de ordenamiento y la propiedad seleccionada
    const sortedItems = sortItems(filteredItems, sortProperty, sortDirection);

    return sortedItems.slice(startIndex, endIndex);
  };

  const handleSortPropertyChange = (property: 'organizationID' | 'name') => {
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
        <FormContainer updateId={updateId} itemName={itemName} h2Text={''} pText={''} handleSubmit={handleSubmit} closeModal={closeModal}>
          <TextInput
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Ingresar Nombre"
          />
        </FormContainer>
      </ModalCRUD>

      <div className='min-h-screen mx-6 my-2'>

        <ItemListHeader title={title} subtitle={subtitle} itemName={itemName} openLoginModal={openLoginModal} fetchItems={fetchItems} handleDeleteSelected={handleDeleteSelected}/>

        <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
          <select
            className="h-12 w-full rounded-lg border-gray-300 text-gray-700 text-sm"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'organizationID' | 'name')}
          >
            <option value="organizationID">ID de la {itemName}</option>
            <option value="name">Nombre de la {itemName}</option>
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

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  <div className='flex items-center gap-1'>
                    Nombre de la {itemName}
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

                <th className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Acciones
                </th>

              </tr>
            </thead>

            <tbody className="divide-y">
              {getCurrentPageItems().map(item => (

                <tr key={item.organizationID} className='text-gray-600'>

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
                    {item.organizationID}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 font-medium">
                    {item.name}
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

                    <Link href={`/${urls[4]}/Vehicles/${item.organizationID}?name=${encodeURIComponent(item.name)}`}>
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

                        Ver Vehiculos
                      </CustomButton>
                    </Link>

                    <Link href={`/${urls[4]}/Users/${item.organizationID}?name=${encodeURIComponent(item.name)}`}>
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
                        Ver Usuarios
                      </CustomButton>
                    </Link>

                    <Link href={`/${urls[4]}/Routes/${item.organizationID}?name=${encodeURIComponent(item.name)}`}>
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />

                        </svg>

                        Ver Rutas
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
    </div>
  );
};

export default OrganizationCRUD;
