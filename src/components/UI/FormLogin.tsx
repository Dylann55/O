/* eslint-disable @typescript-eslint/no-use-before-define */
import Router from 'next/router';
import React, { useEffect, useState } from 'react';

import { fetchDataWithConfig } from '../../utils/Fetch';
import { generateToken } from '../../utils/Jwt';
// Funciones
import {
  checkSession,
  removeSession,
  setSession,
} from '../../utils/LocalStorage';
import { isPasswordValid } from '../../utils/VerifyUser';
import Alert from '../Widgets/Alert';
import AlertVerification from '../Widgets/AlertVerification';
import Button from '../Widgets/Button';
// Components
import Modal from '../Widgets/Modal';
import UserForm from './UserForm';
import CustomButton from '../Widgets/Button/CustomButton';

//Clases

const FormLogin: React.FC = () => {
  // Variables del Componente Modal
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Variable para determinar si existe la sesion
  const [isSession, setIsSession] = useState(false);

  // Variables del Usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Variables de Verificacion y error
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageVerification, setMessageVerification] = useState<string | null>(
    null
  );

  // -------------------------------Funciones para los Modal-------------------------------
  // Funciones que activa el modal para loguearse
  const openLoginModal = () => {
    closeRegisterModal();
    setLoginModalOpen(true);
  };
  // Funcion que cierra el modal para loguearse
  const closeLoginModal = () => {
    setLoginModalOpen(false);
    closeAlert();
  };

  // Funcion que activa el modal para registrarse
  const openRegisterModal = () => {
    closeLoginModal();
    setRegisterModalOpen(true);
  };
  // Funcion que cierra el modal para registrarse
  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
    closeAlert();
  };

  // Funcion que activa el modal para Recuperar contraseña
  const openPasswordModal = () => {
    setPasswordModalOpen(true);
  };
  // Funcion que cierra el modal para recuperar contraseña
  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    closeAlert();
  };

  // -------------------------------Funcion de usuario-------------------------------
  // Funciones para Iniciar Sesion
  const handleLogin = async () => {
    const user = {
      email,
      password,
    };
    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${generateToken(user)}`,
      },
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_MIDDLE_URL}/auth/signinWithEmail`;
      const data = await fetchDataWithConfig(url, config);

      OptionMessageLogin(data);
    } catch (error) {
      setMessageError((error as Error).message);
    }
  };

  // Funcion que determina el tipo de mensaje para la funcion de Inicio de Sesion
  const OptionMessageLogin = (data: any): void => {
    if (data.error) {
      setMessageError(data.error);
    } else if (data.errors) {
      setMessageError(data.errors[0].msg);
    } else if (data.token) {
      setMessageVerification('Ha Iniciado Sesión Correctamente');
      setSession(data.token);
      Router.push('/Organization/MyOrganizations');
    } else {
      setMessageError('Error Inesperado');
    }
  };

  // Funcion para poder registrarse
  const handleRegister = async () => {
    if (!isPasswordValid(password)) {
      setMessageError('Contraseña Invalida');
      return;
    }

    const user = {
      email,
      password,
      name: '',
      lastName: '',
      rut:'00.000.000-0'
    };

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${generateToken(user)}`,
      },
    };
    try {
      const url = `${process.env.NEXT_PUBLIC_MIDDLE_URL}/auth/signupWithEmail`;
      const data = await fetchDataWithConfig(url, config);
      console.log(data)
      OptionMessageRegister(data);
    } catch (error) {
      setMessageError((error as Error).message);
    }
  };

  // Funcion que determina el tipo de mensaje para la funcion de Registro
  const OptionMessageRegister = (data: any): void => {
    if (data.message) {
      if (data.message === 'Usuario registrado') {
        setMessageVerification(
          'Registro hecho correctamente, revisar su email correspondiente'
        );
      } else {
        setMessageError(data.message);
      }
    } else {
      setMessageError('Error Inesperado');
    }
  };

  // Funcion que envia un solicitud de recuperacion de contraseña
  const recoverPassword = async (event: React.FormEvent) => {
    event.preventDefault();
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
        return;
      }
      setMessageError(data.message);
    } catch (error) {
      setMessageError((error as Error).message);
    }
  };

  // -------------------------------Funciones Extra-------------------------------
  // Funcion que cierra las alarma de verificacion y errores
  const closeAlert = () => {
    setMessageError(null);
    setMessageVerification(null);
  };

  // -------------------------------Funciones de para seguir la autenticacion-------------------------------

  // Determinara el usuario esta autenticado
  useEffect(() => {
    setIsSession(checkSession());
  }, []);

  // Si el usuario esta autenticado, mandara al usuario al Lobby principal
  const Dashboard = () => {
    if (isSession) {
      Router.push('/Organization/MyOrganizations');
    }
  };

  // Si el usuario no cerro la sesion refrescara la pagina
  const CloseSession = async () => {
    await removeSession();
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
          <AlertVerification
            message={messageVerification}
            onClose={closeAlert}
          />
        </>
      )}

      <div className="flex items-center justify-center gap-2 sm:flex-row">
        {!isSession && (
          <div className="w-96 sm:w-52 md:w-36">
            <CustomButton onClick={openLoginModal} type="button"
              color="indigo"
              padding_x="0"
              padding_smx="0"
              padding_mdx="0"
              padding_y="2.5"
              width="full"
              height="10"
            >
              Ingresar
            </CustomButton>
          </div>
        )}

        {isSession && (
          <>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <div className="flex-1 w-96 sm:w-52 md:w-36">
                <CustomButton onClick={Dashboard} type="button"
                  color="indigo"
                  padding_x="0"
                  padding_smx="0"
                  padding_mdx="0"
                  padding_y="2.5"
                  width="full"
                  height="10"
                >
                  Dashboard
                </CustomButton>
              </div>
              <div className="flex-1 w-96 sm:w-52 md:w-36">
                <CustomButton onClick={CloseSession} type="button"
                  color="indigo"
                  padding_x="0"
                  padding_smx="0"
                  padding_mdx="0"
                  padding_y="2.5"
                  width="full"
                  height="10"
                >
                  Cerrar Sesión
                </CustomButton>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={loginModalOpen}>
        <UserForm
          labelText="Inicio de Sesion"
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
          submitButtonLabel="Iniciar Sesión"
          onCancel={closeLoginModal}
          openModal={openRegisterModal}
          textModal="No tienes creado una Cuenta?"
          submitButtonModal="Registrarse"
          openModalPassword={openPasswordModal}
        />
      </Modal>

      <Modal isOpen={registerModalOpen}>
        <UserForm
          labelText="Registro"
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleRegister}
          submitButtonLabel="Registrarse"
          onCancel={closeRegisterModal}
          openModal={openLoginModal}
          textModal="Ya tienes creado una Cuenta?"
          submitButtonModal="Iniciar Sesion"
          openModalPassword={openPasswordModal}
        />
      </Modal>

      <Modal isOpen={passwordModalOpen}>
        <div className="mx-auto max-w-screen items-center">
          <form
            onSubmit={recoverPassword}
            className="mb-0 space-y-2 rounded-lg p-6 sm:p-8 lg:p-10"
          >
            <div className="mx-auto max-w-lg text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Bienvenido a Overonce!
              </h1>

              <h2 className="text-center text-lg font-medium">
                Recuperacion de Contraseña
              </h2>

              <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                Se enviara una solicitud para restablecer la contraseña de tu
                cuenta.
              </p>
            </div>

            <div className="relative flex items-center">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                <svg
                  x="0px"
                  y="0px"
                  width="12px"
                  height="13px"
                  className="mr-2"
                >
                  <path
                    fill="#B1B7C4"
                    d="M8.9,7.2C9,6.9,9,6.7,9,6.5v-4C9,1.1,7.9,0,6.5,0h-1C4.1,0,3,1.1,3,2.5v4c0,0.2,0,0.4,0.1,0.7 C1.3,7.8,0,9.5,0,11.5V13h12v-1.5C12,9.5,10.7,7.8,8.9,7.2z M4,2.5C4,1.7,4.7,1,5.5,1h1C7.3,1,8,1.7,8,2.5v4c0,0.2,0,0.4-0.1,0.6 l0.1,0L7.9,7.3C7.6,7.8,7.1,8.2,6.5,8.2h-1c-0.6,0-1.1-0.4-1.4-0.9L4.1,7.1l0.1,0C4,6.9,4,6.7,4,6.5V2.5z M11,12H1v-0.5 c0-1.6,1-2.9,2.4-3.4c0.5,0.7,1.2,1.1,2.1,1.1h1c0.8,0,1.6-0.4,2.1-1.1C10,8.5,11,9.9,11,11.5V12z"
                  />
                </svg>
              </label>

              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                placeholder="Enter email"
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

            <div className='space-y-1 mt-4'>
              <div className="flex flex-row justify-center items-center gap-2">
                <div className="flex-1 sm:w-auto">
                  <Button
                    onClick={recoverPassword}
                    className="w-full h-10 text-white inline-flex items-center justify-center gap-2 rounded border border-indigo-600 bg-indigo-600 hover:text-indigo-600 px-0 py-2.5 text-sm font-medium hover:bg-transparent focus:outline-none focus:ring"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    Recuperar Contraseña
                  </Button>
                </div>
                <div className="flex-1 sm:w-auto">
                  <CustomButton onClick={closePasswordModal} type="button"
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
          </form>
        </div>
      </Modal>
    </>
  );
};

export default FormLogin;
