import React, { useState } from 'react';

import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';

import { generateToken } from '@/utils/Jwt';
import { fetchDataWithConfig } from '@/utils/Fetch';
import { ReadRequest, UpdateRequest } from '@/utils/CRUD';
import CustomButton from '../Widgets/Button/CustomButton';

interface Item {
  id: number;
  name: string;
  email: string;
  lastName: string;
}

const url_item = process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage';

const ProfileCRUD: React.FC = () => {

  const [itemName] = useState<string>('Usuario');

  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    name: '',
    email: '',
    lastName: ''
  });


  // -------------------------------Funciones Para el CRUD-------------------------------

  const fetchItems = async () => {
    try {
      const url = url_item + `/myUserData`;

      const access_token = localStorage.getItem('access_token_Request');

      if (access_token) {
        const config = {
          access_token: access_token,
        }
        const response = await ReadRequest(url, config);
        if (!response.error) {
          setItems(response.data);
        }
        else {
          setMessageError(response.error.message);
        }
      }
      else {
        setMessageError("Expiro la Session")
      }

    } catch (error) {
      setMessageError('Error fetching data:' + (error as Error).message);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = url_item + `/updateMyUser`;
      const access_token = localStorage.getItem('access_token_Request');

      if (access_token) {
        const config = {
          name: newItem.name,
          lastName: newItem.lastName,
          access_token: access_token,
        }

        const response = await UpdateRequest(url, config);
        OptionMessage(response);
      }

      else {
        setMessageError("Expiro la Session")
      }
    } catch (error) {
      setMessageError('Error updating item:' + (error as Error).message);
    }
  };

  const ClearItem = () => {
    setNewItem({
      id: 0,
      name: '',
      email: '',
      lastName: '',
    });
  }

  const OptionMessage = (data: any): void => {
    if (data.error) {
      setMessageError(data.error);
    }
    else if (data.message) {
      if (data.message == "El name y lastName del usuario se han actualizado con exito") {
        setMessageVerification(data.message);
        closeModal();
        fetchItems();
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
  // -------------------------------Funciones de Extra-------------------------------
  const changePassword = async () => {

    const email = localStorage.getItem('email');

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      fetchItems();
    }
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
  };

  return (
    <>

      <div className="relative ">
        <div>
          <button
            type="button"
            onClick={toggleMenu}
            className="t group relative flex justify-center rounded bg-gray-900 px-3.5 py-1.5 text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span style={{ pointerEvents: "none" }}
              className={`translate-x-16 absolute start-full top-1/2 -translate-y-1/2  rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100`}>
              Perfil
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <>
            {!ModalOpen && (
              <div className="ml-3 absolute start-full top-1/2 -translate-y-1/2 translate-x-12 mt-2 w-80 py-1 bg-white border border-gray-100 rounded-lg shadow-lg dark:bg-neutral-900 dark:border-gray-600">
                {items.map((item) => (
                  <blockquote className="px-4" key={item.id}>

                    <div className="flex items-center gap-4">
                      <img
                        alt="Man"
                        src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                        className="h-16 w-16 rounded-full object-cover"
                      />

                      <div>
                        <div className="flex justify-start gap-0.5 text-green-500">
                          <p className="mt-4 text-sm text-gray-900 dark:text-white">
                            {item.id}
                          </p>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                          {item.name} {item.lastName}
                        </p>
                        <p className="mt-0 text-sm text-gray-900 dark:text-white">
                          {item.email}
                        </p>
                      </div>
                    </div>

                    <div className='flex justify-center m-1'>
                      <CustomButton onClick={openLoginModal}
                        type="button"
                        color="indigo"
                        padding_x="4"
                        padding_smx="4"
                        padding_mdx="4"
                        padding_y="1.5"
                        width="80"
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
                    </div>

                  </blockquote>
                ))}
              </div>
            )}

            {ModalOpen && (
              <div className="ml-3 absolute start-full top-1/2 -translate-y-1/4 translate-x-12 mt-2 w-80 py-1 bg-white border border-gray-100 rounded-lg shadow-lg dark:bg-neutral-900 dark:border-gray-600">
                <form onSubmit={handleUpdate} className="space-y-4 rounded-lg p-2 sm:p-4 lg:p-6">

                  <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-gray-300 text-2xl font-bold">
                      Editar {itemName}
                    </h1>

                    <h2 className="text-center text-lg font-medium">
                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                    </p>
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
                      id="lastName"
                      value={newItem.lastName || ''}
                      onChange={(e) => setNewItem({ ...newItem, lastName: e.target.value })}
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

                  <div className="flex items-center justify-center">
                    <CustomButton
                      type="button"
                      color="indigo"
                      padding_x="14"
                      padding_smx="14"
                      padding_mdx="14"
                      padding_y="3"
                      width="80"
                      height="10"
                      onClick={() => changePassword()}
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
                    </CustomButton>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-row sm:justify-center">

                    <CustomButton type="submit"
                      color="indigo"
                      padding_x="6"
                      padding_smx="6"
                      padding_mdx="6"
                      padding_y="3"
                      width="36"
                      height="10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                      </svg>

                      Guardar
                    </CustomButton>

                    <CustomButton onClick={closeModal} type="button"
                      color="red"
                      padding_x="6"
                      padding_smx="6"
                      padding_mdx="6"
                      padding_y="3"
                      width="36"
                      height="10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>

                      Cancelar

                    </CustomButton>

                  </div>

                </form>
              </div>
            )}

          </>


        )}
      </div>


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

    </>
  );
};

export default ProfileCRUD;