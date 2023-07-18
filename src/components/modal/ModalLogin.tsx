import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';

import UserChip from '@/components/UserChip';

import FormAlert from '../FormAlert';

const ModalLogin = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [showModal, setShowModal] = useState(false);
  const [emailData, setEmailData] = useState('');
  const [passwordData, setPasswordData] = useState('');
  const [hideModalAlert, setHideModalAlert] = useState(true);
  const [titleModalAlert, setTitleModalAlert] = useState('');
  const [messageModalAlert, setMessageModalAlert] = useState('');
  const [modalUtility, setModalUtility] = useState('Ingreso');

  async function SignUpWithEmail() {
    const { error } = await supabase.auth.signUp({
      email: emailData,
      password: passwordData,
    });

    if (error) {
      setHideModalAlert(false);

      if (error.name === 'AuthApiError') {
        setTitleModalAlert('Ups, Hay un problema');
        setMessageModalAlert(
          `hay un problema de conexión, intenta más tarde, ${JSON.stringify(
            error
          )}`
        );
      }
    } else {
      setShowModal(false);
    }
  }

  async function SignInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailData,
      password: passwordData,
    });

    if (error) {
      setHideModalAlert(false);

      if (error.name === 'AuthApiError') {
        setTitleModalAlert('Ups, corrige los datos');
        setMessageModalAlert(`Revisa tus credenciales.`);
      } else {
        setTitleModalAlert('Ups, Hay un problema');
        setMessageModalAlert('hay un problema de conexión, intenta más tarde');
      }
    } else {
      setShowModal(false);
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setHideModalAlert(false);

      if (error.name === 'AuthApiError') {
        setTitleModalAlert('Ups, corrige los datos');
        setMessageModalAlert('Revisa tus credenciales.');
      } else {
        setTitleModalAlert('Ups, Hay un problema');
        setMessageModalAlert('hay un problema de conexión, intenta más tarde');
      }
    } else {
      setShowModal(false);
    }
  }

  async function PasswordRecovery() {
    const { error } = await supabase.auth.signInWithOtp({
      email: emailData,
      options: {
        emailRedirectTo: process.env.AFTER_LOGIN_URI,
      },
    });

    if (error) {
      setHideModalAlert(false);
      if (
        error.message ===
        'For security purposes, you can only request this once every 60 seconds'
      ) {
        setTitleModalAlert('Ups, Hay un problema');
        setMessageModalAlert(
          'No puedes solicitar tu contraseña en intervalos menores a 60 segundos'
        );
      } else {
        setTitleModalAlert('Ups, Hay un problema');
        setMessageModalAlert(
          'Intenta conectarte más tarde y notifica al administrador'
        );
      }
    } else {
      setShowModal(false);
    }
  }

  function changeUtility(utility: string) {
    setModalUtility(utility);
    setHideModalAlert(true);
    setTitleModalAlert('');
    setMessageModalAlert('');
  }

  function componentUtility() {
    switch (modalUtility) {
      case 'Ingreso': {
        return (
          <div>
            <div className="mb-4">
              <input
                type="email"
                className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                id="emailInput"
                required
                placeholder="Correo Electrónico"
                minLength={5}
                maxLength={255}
                value={emailData || ''}
                onChange={(e) => setEmailData(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                id="passwordInput"
                placeholder="Contraseña"
                required
                value={passwordData || ''}
                onChange={(e) => setPasswordData(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                className="mb-3 inline-block w-full rounded bg-uta-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white  transition duration-150 ease-in-out hover:bg-uta-primary/80 focus:outline-none focus:ring-0"
                type="submit"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={SignInWithEmail}
              >
                Ingresar
              </button>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={signInWithGoogle}
                className="flex w-full items-center justify-center rounded-md border bg-white text-sm text-black focus:outline-none"
              >
                <svg
                  className="m-2 h-4 w-4"
                  viewBox="0 0 21 20"
                  width="16px"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_13183_10121)">
                    <path
                      d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                      fill="#3F83F8"
                    ></path>
                    <path
                      d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                      fill="#FBBC04"
                    ></path>
                    <path
                      d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                      fill="#EA4335"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_13183_10121">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(0.5)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
                Entrar con Google
              </button>
              <a
                className="text-xs text-gray-500"
                href="#!"
                onClick={() => changeUtility('Recuperación')}
              >
                ¿Olvidaste tu contraseña?
              </a>
              <div className="my-6 flex items-center justify-between">
                <p className="mb-0 mr-2 text-xs">¿Aun no estas registrado?</p>
                <button
                  type="button"
                  className="inline-block rounded border-2 bg-uta-tertiary px-6 py-2 text-xs font-medium uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-uta-tertiary/80 focus:outline-none focus:ring-0"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  onClick={() => {
                    changeUtility('Registro');
                  }}
                >
                  Crear Cuenta
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 'Registro': {
        return (
          <div>
            <div className="mb-4">
              <input
                type="email"
                className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                id="emailInput"
                required
                placeholder="Correo Electrónico"
                minLength={5}
                maxLength={255}
                value={emailData || ''}
                onChange={(e) => setEmailData(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                id="passwordInput"
                placeholder="Contraseña"
                required
                value={passwordData || ''}
                onChange={(e) => setPasswordData(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                className="mb-3 inline-block w-full rounded bg-uta-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white  transition duration-150 ease-in-out hover:bg-uta-primary/80 focus:outline-none focus:ring-0"
                type="submit"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={SignUpWithEmail}
              >
                Registrarse
              </button>
              <a
                className="text-xs text-gray-500"
                href="#!"
                onClick={() => changeUtility('Recuperación')}
              >
                Olvidaste tu contraseña?
              </a>
              <div className="my-6 flex items-center justify-between">
                <p className="mb-0 mr-2 text-xs">¿Ya tienes cuenta?</p>
                <button
                  type="button"
                  className="inline-block rounded border-2 bg-uta-tertiary px-6 py-2 text-xs font-medium uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-uta-tertiary/80 focus:outline-none focus:ring-0"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  onClick={() => {
                    changeUtility('Ingreso');
                  }}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        );
      }
      case 'Recuperación': {
        return (
          <div>
            <div className="mb-4">
              <input
                type="email"
                className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                id="emailInput"
                required
                placeholder="Correo Electrónico"
                minLength={5}
                maxLength={255}
                value={emailData || ''}
                onChange={(e) => setEmailData(e.target.value)}
              />
            </div>

            <div className="text-center">
              <button
                className="mb-3 inline-block w-full rounded bg-uta-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white  transition duration-150 ease-in-out hover:bg-uta-primary/80 focus:outline-none focus:ring-0"
                type="submit"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                onClick={PasswordRecovery}
              >
                Ingresar por Correo Electrónico
              </button>

              <div className="my-6 flex items-center justify-between">
                <p className="mb-0 mr-2 text-xs">
                  ¿Ya recuerdas tu contraseña?
                </p>
                <button
                  type="button"
                  className="inline-block rounded border-2 bg-uta-tertiary px-6 py-2 text-xs font-medium uppercase leading-tight text-white transition duration-150 ease-in-out hover:bg-uta-tertiary/80 focus:outline-none focus:ring-0"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  onClick={() => {
                    changeUtility('Ingreso');
                  }}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        );
      }
      default: {
        return '';
      }
    }
  }

  return (
    <>
      {session ? (
        <UserChip
          avatar="https://zhlmtsrunrqtiixwhpvv.supabase.co/storage/v1/object/sign/avatars/avatar_default_black.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2F2YXRhcl9kZWZhdWx0X2JsYWNrLnN2ZyIsImlhdCI6MTY3NDY3NTQwNCwiZXhwIjoxNzA2MjExNDA0fQ.IhVV5mRKQ-uEO0MnilBCrKy_pkLMKZLDBEWMcu3_umg&t=2023-01-25T19%3A36%3A44.554Z"
          username="Felipe Morales Aliaga"
          session={session}
        ></UserChip>
      ) : (
        <button
          className="right-0 flex items-center rounded bg-uta-primary py-1 px-4 font-bold text-white/80 hover:text-white"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <span>Entrar</span>
        </button>
      )}

      {showModal ? (
        <>
          <div
            className=" fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 outline-none focus:outline-none"
            onClick={(event) => {
              event.preventDefault();

              if (event.target === event.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <div className="h-full">
              <div className="flex h-full flex-wrap items-center justify-center text-gray-800">
                <div className="">
                  <div className="block rounded-lg bg-white shadow-lg">
                    <div className="lg:flex lg:flex-wrap">
                      <div className="mx-12 w-[300px]">
                        <div>
                          {!session ? (
                            <div>
                              <div className="p-8 text-center">
                                <img
                                  className="mx-auto w-48"
                                  src="/assets/logo/logo_color.svg"
                                  alt="logo"
                                />
                              </div>
                              <form>
                                <p className="mb-4">{modalUtility}</p>
                                <FormAlert
                                  hidden={hideModalAlert}
                                  title={titleModalAlert}
                                  message={messageModalAlert}
                                />
                                {componentUtility()}
                              </form>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalLogin;
