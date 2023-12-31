import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import Alert from '@/components/Widgets/Alert';
import AlertVerification from '@/components/Widgets/AlertVerification';
import { AuthState, UpdatePassword } from '@/utils/DBFuntion';
import { isPasswordValid } from '@/utils/VerifyUser';
import CustomButton from '@/components/Widgets/Button/CustomButton';
import ModalPassword from '@/components/Widgets/ModalPassword';

const ResetPassword = () => {
  // Inicializo un clase para las funciones de la base de datos
  const instanciaUpdatePassword = new UpdatePassword();
  const instanciaAuthState = new AuthState();

  // Variables del Usuario
  const router = useRouter();
  const [password, setPassword] = useState('');

  // // Variables del Componente Modal
  const [passwordModalOpen] = useState(true);

  // Variables de Verificacion y error
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageVerification, setMessageVerification] = useState<string | null>(
    null
  );

  const ChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!isPasswordValid(password)) {
        setMessageError('Contraseña Invalida');
        return;
      }

      const result = await instanciaUpdatePassword.updatePassword(password);

      if (result.error) {
        setMessageError(
          'La contraseña nueva tiene que ser distinta a la anterior'
        );
        return;
      }

      setMessageVerification('Contraseña actualizada con éxito');
      router.push('/');
    } catch (error) {
      setMessageError((error as Error).message);
    }
  };

  useEffect(() => {
    instanciaAuthState.startListening();
  }, []);

  // Funcion que cierra las alarma de verificacion y errores
  const closeAlert = () => {
    setMessageError(null);
    setMessageVerification(null);
  };

  // Funcion que cierra el modal para recuperar contraseña
  const closePasswordModal = (): void => {
    closeAlert();
    router.push('/');
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

      <ModalPassword isOpen={passwordModalOpen}>
        <div className="mx-auto max-w-screen-sm items-center gap-1 px-0 py-2 sm:mt-5">
          <form
            onSubmit={ChangePassword}
            className="space-y-4 rounded-lg p-4 sm:p-6 lg:p-8"
          >
            <div className="mx-auto max-w-lg text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">
                Bienvenido a Overonce!
              </h1>

              <h2 className="text-center text-lg font-medium">
                Cambio de Contraseña
              </h2>

              <p className="mx-auto mt-4 max-w-md text-center text-sm text-gray-500">
                La contraseña debe cumplir con las siguientes características:
                <br />
                - No se permite el uso de contraseñas repetidas.
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
            </div>

            <div className="relative col-span-6 flex items-center sm:col-span-3">
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
                onChange={(e) => setPassword(e.target.value)}
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

            <div className='space-y-1 mt-4'>
              <div className="flex flex-row justify-center items-center gap-2">
                <div className="flex-1 sm:w-auto">
                  <Button
                    onClick={ChangePassword}
                    className="w-full h-10 text-white inline-flex items-center justify-center gap-2 rounded border border-indigo-600 bg-indigo-600 hover:text-indigo-600 px-0 py-2.5 text-sm font-medium hover:bg-transparent focus:outline-none focus:ring"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    Cambiar contraseña
                  </Button>
                </div>
                <div className="flex-1 sm:w-auto">
                  <CustomButton onClick={closePasswordModal} type="button"
                    color="indigo"
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

                    Volver
                  </CustomButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModalPassword>
    </>
  );
};

export default ResetPassword;
