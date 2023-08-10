import type { ChangeEvent, FormEvent } from 'react';
import React, { useEffect, useState } from 'react';

import ButtonCustomer from '../Widgets/ButtonCustomer';
import SocialButtons from './FormIcons';
import CustomButton from '../Widgets/Button/CustomButton';
import Button from '../Widgets/Button';

type UserFormProps = {
  labelText: string;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  submitButtonLabel: string;
  onCancel: () => void;
  openModal: () => void;
  textModal: string;
  submitButtonModal: string;
  openModalPassword: () => void;
};

const UserForm: React.FC<UserFormProps> = ({
  labelText,
  email,
  password,
  setEmail,
  setPassword,
  handleLogin,
  submitButtonLabel,
  onCancel,
  openModal,
  textModal,
  submitButtonModal,
  openModalPassword,
}) => {
  // Variables para el NextAuth
  const [isLogin, setIsLogin] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleLogin();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleModal = () => {
    openModal();
  };

  const handleModalPassword = () => {
    openModalPassword();
  };

  useEffect(() => {
    if (submitButtonModal !== 'Registrarse') setIsLogin(true);
  }, []);

  return (
    <>
      <div className="mx-auto max-w-screen items-center">
        <form
          onSubmit={handleSubmit}
          className="mb-0 space-y-2 rounded-lg p-4 sm:p-6 lg:p-8"
        >
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Bienvenido a Overonce!
            </h1>
            <h2 className="text-center text-lg font-medium">{labelText}</h2>

            {isLogin && (
              <>
                <p className="mx-auto mt-4 max-w-md text-center text-xs sm:text-sm text-gray-500">
                  La contraseña debe cumplir con las siguientes características:
                  <br />
                  - Debe tener una longitud mínima de 6 caracteres.
                  <br />
                  - Debe contener al menos una letra mayúscula.
                  <br />
                  - Debe contener al menos una letra minúscula.
                  <br />
                  - Debe contener al menos un número.
                  <br />- Debe contener al menos un carácter especial.
                </p>
              </>
            )}

            <p className="mx-auto mt-4 max-w-md text-center text-gray-500"></p>
          </div>

          <div className='space-y-3'>
            <div className="relative flex items-center">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                <svg x="0px" y="0px" width="12px" height="13px" className="mr-2">
                  <path
                    fill="#B1B7C4"
                    d="M8.9,7.2C9,6.9,9,6.7,9,6.5v-4C9,1.1,7.9,0,6.5,0h-1C4.1,0,3,1.1,3,2.5v4c0,0.2,0,0.4,0.1,0.7 C1.3,7.8,0,9.5,0,11.5V13h12v-1.5C12,9.5,10.7,7.8,8.9,7.2z M4,2.5C4,1.7,4.7,1,5.5,1h1C7.3,1,8,1.7,8,2.5v4c0,0.2,0,0.4-0.1,0.6 l0.1,0L7.9,7.3C7.6,7.8,7.1,8.2,6.5,8.2h-1c-0.6,0-1.1-0.4-1.4-0.9L4.1,7.1l0.1,0C4,6.9,4,6.7,4,6.5V2.5z M11,12H1v-0.5 c0-1.6,1-2.9,2.4-3.4c0.5,0.7,1.2,1.1,2.1,1.1h1c0.8,0,1.6-0.4,2.1-1.1C10,8.5,11,9.9,11,11.5V12z"
                  />
                </svg>
              </label>

              <input
                type="email"
                id="email"
                onChange={handleEmailChange}
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
            <div className="relative flex items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                <svg x="0px" y="0px" width="15px" height="5px" className="mr-2">
                  <g>
                    <path
                      fill="#B1B7C4"
                      d="M6,2L6,2c0-1.1-1-2-2.1-2H2.1C1,0,0,0.9,0,2.1v0.8C0,4.1,1,5,2.1,5h1.7C5,5,6,4.1,6,2.9V3h5v1h1V3h1v2h1V3h1 V2H6z M5.1,2.9c0,0.7-0.6,1.2-1.3,1.2H2.1c-0.7,0-1.3-0.6-1.3-1.2V2.1c0-0.7,0.6-1.2,1.3-1.2h1.7c0.7,0,1.3,0.6,1.3,1.2V2.9z"
                    />
                  </g>
                </svg>
              </label>

              <input
                type="password"
                id="password"
                onChange={handlePasswordChange}
                value={password}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
                placeholder="Enter password"
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
          <div>
            <div className='space-y-1 mt-4'>
              <div className="flex flex-row justify-center items-center gap-2 mb-3">
                <div className="flex-1 sm:w-auto">
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-10 text-white inline-flex items-center justify-center gap-2 rounded border border-indigo-600 bg-indigo-600 hover:text-indigo-600 px-0 py-2.5 text-sm font-medium hover:bg-transparent focus:outline-none focus:ring"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    {submitButtonLabel}
                  </Button>
                </div>
                <div className="flex-1 sm:w-auto">
                  <CustomButton onClick={handleCancel} type="button"
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

              <p className="text-center text-sm text-gray-500">
                <span className="mr-1">{textModal}</span>
                <ButtonCustomer
                  onClick={handleModal}
                  className="hover:font-semibold hover:text-indigo-500"
                >
                  {submitButtonModal}
                </ButtonCustomer>
              </p>

              {!isLogin && (
                <>
                  <p className="text-center text-sm text-gray-500">
                    <ButtonCustomer
                      onClick={handleModalPassword}
                      className="hover:font-semibold hover:text-indigo-500"
                    >
                      Olvidaste la Contraseña?
                    </ButtonCustomer>
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center w-80">
                <hr className="h-1 w-full rounded bg-indigo-500" />
                <span className="mx-2 text-gray-500 text-xl">o</span>
                <hr className="h-1 w-full rounded bg-indigo-500" />
              </div>
              <SocialButtons />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserForm;
