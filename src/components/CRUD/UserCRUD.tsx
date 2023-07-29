import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ModalCRUD from '../Widgets/ModalCRUD';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import CustomButton from '../Widgets/Button/CustomButton';

import { CreateRequest, DeleteRequest, ReadRequest } from '@/utils/CRUD';
import { getSession } from '@/utils/LocalStorage';

interface Item {
  userHasProfile: number;
  userID: string;
  profileID: number;
  organizationID: number;
}

type Profile = {
  profileIDs: number[];
};

const ITEMS_PER_PAGE = 30; // Numero de elementos a mostrar por pagina

interface UserCRUDProps {
  urls: string[];
}

const UserCRUD: React.FC<UserCRUDProps> = ({ urls }) => {

  const [itemName] = useState<string>('Perfil');
  const router = useRouter();
  const { id, name, O_ID } = router.query;

  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    userHasProfile: 0,
    userID: '',
    profileID: 0,
    organizationID: 0
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
          organizationID: O_ID,
          userID: id,
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

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {

      for (const profileID of Profile.profileIDs) {

        const url = urls[1] || '';

        const access_token = localStorage.getItem('access_token_Request');
        console.log(Profile);
        if (access_token) {
          const Item = { ...newItem, access_token: access_token, userID: id, organizationID: O_ID, profileID: profileID };
          const response = await CreateRequest(url, Item);
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
        const idsToDelete = selectedItems.map(item => item.userHasProfile);
        for (const idToDelete of idsToDelete) {
          const config = {
            access_token: access_token,
            userHasProfile: idToDelete,
            organizationID: O_ID,
            userID: id
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

  const clearItem = () => {
    setNewItem({
      userHasProfile: 0,
      userID: '',
      profileID: 0,
      organizationID: 0
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
    console.log(data)
    if (data.error) {
      setMessageError(data.error);
    }
    else if (data.message) {
      if (data.message == "Perfil de usuario agregado" ||
        data.message == "Se elimino el perfil del usuario en la empresa" ||
        data.message == "se elimino el perfil exitosamente" ||
        data.message == "se eliminó el perfil exitosamente"
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
    clearCheckbox();
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
          <form onSubmit={handleCreate} className="mb-0 mt-6 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-lg text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Asignacion de Roles para {name}
              </h1>

              <h2 className="text-center text-lg font-medium">

              </h2>

              <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
              </p>
            </div>

            <div>
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

                Asignar Roles
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


      <div className=' bg-gray-100 min-h-screen pt-3 mx-2'>

        <div className='flex justify-center gap-1 sm:gap-2 mt-2'>

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
            Asignar Roles
          </CustomButton>

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
            Eliminar Roles
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
                  Roles
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {getCurrentPageItems().map(item => (

                <tr key={item.userHasProfile}>

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
                    {item.profileID == 2 && (
                      <span
                        className={`mr-1 px-2.5 py-0.5 rounded bg-blue-200 text-blue-800`}>
                        Jefe
                      </span>
                    )}
                    {item.profileID == 3 && (
                      <span
                        className={`mr-1 px-2.5 py-0.5 rounded bg-yellow-200 text-yellow-800`}>
                        Proovedor
                      </span>
                    )}
                    {item.profileID == 4 && (
                      <span
                        className={`mr-1 px-2.5 py-0.5 rounded bg-green-200 text-green-800'`}>
                        Chofer
                      </span>
                    )}
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
