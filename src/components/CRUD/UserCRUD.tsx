import React, { useState, useEffect } from 'react';

import { BsPersonFill } from 'react-icons/bs';
import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';

import { generateToken } from '@/utils/Jwt';
import { fetchDataWithConfig } from '@/utils/Fetch';
import { CreateRequest, DeleteRequest, ReadRequestS, UpdateRequest } from '@/utils/CRUD';

interface Item {
  id: number;
  name: string;
  email: string;
  lastname: string;
}

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina
const url_item = process.env.NEXT_PUBLIC_MIDDLE_URL;

const UserCRUD: React.FC = () => {

  const [itemName] = useState<string>('Usuario');

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    name: '',
    email: '',
    lastname: ''
  });

  const [updateId, setUpdateId] = useState<number | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  // -------------------------------Funciones Para el CRUD-------------------------------

  const fetchItems = async () => {
    try {
      const url = url_item + ``

      const response = await ReadRequestS(url);
      if (response && response.data) {
        setItems(response.data);
      }
      else {
        setMessageError(response.error.message);
      }

    } catch (error) {
      setMessageError('Error fetching data:' + (error as Error).message);
    }
  };

  const handleCreate = async () => {
    try {
      const url = url_item + ``

      const response = await CreateRequest(url, newItem);

      // Actualizar el estado de items con los nuevos datos
      if (response && response.data) {
        fetchItems();
      }
      else {
        setMessageError(response.error.message);
      }

      ClearItem();
    } catch (error) {
      setMessageError('Error creating item:' + (error as Error).message);
    }
  };

  const handleUpdate = async () => {
    if (updateId === null) return;

    try {

      console.log(newItem);
      const url = url_item + `/${updateId}`

      const response = await UpdateRequest(url, newItem);

      // Actualizar el estado de items con los nuevos datos
      if (response && response.data) {
        fetchItems();
      }
      else {
        setMessageError(response.error.message);
      }

      ClearItem();
    } catch (error) {
      setMessageError('Error updating item:' + (error as Error).message);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const idsToDelete = selectedItems.map(item => item.id);

      console.log(idsToDelete);

      const url = url_item + ``

      const response = await DeleteRequest(url, newItem);

      // Actualizar el estado de items con los nuevos datos
      if (response && response.data) {
        fetchItems();
      }
      else {
        setMessageError(response.error.message);
      }

      const updatedItems = items.filter(item => !idsToDelete.includes(item.id));
      setItems(updatedItems);
      setSelectedItems([]);
    } catch (error) {
      setMessageError('Error deleting items:' + (error as Error).message);
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
      email: item.email,
      lastname: item.lastname,
    });
    openLoginModal();
  };

  const ClearItem = () => {
    setUpdateId(null);
    setNewItem({
      id: 0,
      name: '',
      email: '',
      lastname: '',
    });
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

  // -------------------------------Funciones para la Paginacion-------------------------------
  const getCurrentPageItems = () => {
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
  const changePassword = async (email: string) => {
    const user = {
      email,
    };

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${generateToken(user)}`,
      },
    };
    try {
      const url = `${process.env.NEXT_PUBLIC_MIDDLE_URL}/auth/recoverPassword`;
      const data = await fetchDataWithConfig(url, config);
      if (data.message === 'Correo de restablecimiento de contraseña enviado') {
        setMessageVerification(data.message);
      }
      setMessageError(data.message);
    } catch (error) {
      setMessageError((error as Error).message);
    }
  }

  useEffect(() => {
    fetchItems();
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

    ClearItem();

    closeAlert();
  };

  return (
    <div>

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
        <div className="mx-auto mt-10 max-w-screen items-center px-6 sm:px-8">
          <form onSubmit={handleSubmit} className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-lg text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
              </h1>

              <h2 className="text-center text-lg font-medium">
              </h2>

              <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
              </p>
            </div>

            <div>
              <div className="relative flex items-center">
                <input
                  type="text"
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
                  type="text"
                  id="name"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                  placeholder="Ingresar Nombre"
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
                  id="lastname"
                  value={newItem.lastname || ''}
                  onChange={(e) => setNewItem({ ...newItem, lastname: e.target.value })}
                  className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                  placeholder="Ingresar Apellido"
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
              <button type="submit"
                className="inline-flex items-center gap-2 rounded bg-indigo-600 px-8 sm:px-10 md:px-16 py-2.5 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
              >
                {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center gap-2 rounded bg-red-600 px-12 sm:px-10 md:px-20 py-2.5 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </ModalCRUD>

      <div className='bg-gray-100 min-h-screen ml-2 sm:ml-5 mr-2 sm:m-5'>

        <div className='flex justify-center gap-6 mt-4'>

          <button className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 sm:px-10 md:px-20 py-2.5 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500" onClick={openLoginModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Crear {itemName}
          </button>
          <button className="inline-flex items-center gap-2 rounded bg-red-600 px-4 sm:px-10 md:px-20 py-2.5 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500" onClick={handleDeleteSelected}>
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
          </button>


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
                  Nombre Completo
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Email
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Metodos
                </th>

                <th className="text-start whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Accion
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {getCurrentPageItems().map(item => (
                <tr key={item.id} className=''>

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

                  <td className="px-4 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-6 sm:px-12 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                      onClick={() => handleEdit(item)}
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
                    </button>
                  </td>

                  <td className="px-4 py-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-2 sm:px-3 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                      onClick={() => changePassword(item.email)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path strokeLinecap="round"
                          strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Cambiar Contraseña
                    </button>
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

export default UserCRUD;
