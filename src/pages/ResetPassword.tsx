import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import createClient from '@/db/supabaseClient';

import Modal from '@/components/Widgets/Modal';

import { Button } from '@/components/Button';
import ButtonCustomer from '@/components/Widgets/ButtonCustomer';
import Alert from '@/components/Widgets/Alert';
import AlertVerification from '@/components/Widgets/AlertVerification';

import { isPasswordValid } from '@/utils/VerifyUser';
import { generateToken } from '@/utils/Jwt';

const ResetPassword = () => {
  // Variables del Usuario
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [access_token, setAccessToken] = useState<string>('');

  // Variables del Componente Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(true);

  // Variables de Verificacion y error
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageVerification, setMessageVerification] = useState<string | null>(null);

  const ChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    try {

      if (!isPasswordValid(password)) {
        setMessageError('Contraseña Invalida');
        return;
      }

      const user = {
        access_token : access_token,
      };
      const config = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${generateToken(user)}`,
        },
      };
      
      console.log(user);

      setMessageVerification('Contraseña actualizada con éxito');
    } catch (error) {
      setMessageError((error as Error).message);
    }
  };

  useEffect(() => {
    createClient.auth.onAuthStateChange(async (event, session) => {
      console.log("El evento es: ", event);
      if (session == null) {
        router.push('/');
      }
      const access_token = session?.access_token ?? '';
      setAccessToken(access_token);
    });
  }, []);


  // Funcion que cierra las alarma de verificacion y errores
  const closeAlert = () => {
    setMessageError(null);
    setMessageVerification(null);
  };

  //Funcion que cierra el modal para recuperar contraseña
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
          <AlertVerification message={messageVerification} onClose={closeAlert} />
        </>
      )}

      <Modal isOpen={passwordModalOpen}>
        <div className="items-center mx-auto max-w-screen-sm px-0 py-2 mt-20 sm:mt-5 gap-1">

          <form onSubmit={ChangePassword} className="mb-0 mt-1 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-lg text-center">

              <h1 className="text-2xl font-bold sm:text-3xl">Bienvenido a Overonce!</h1>

              <h2 className="text-center text-lg font-medium">Cambio de Contraseña</h2>

              <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
              </p>
            </div>

            <div className="relative col-span-6 sm:col-span-3 flex items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
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

            <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-2">
              <Button onClick={ChangePassword}
                className="inline-block rounded bg-indigo-600 px-9 sm:px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500">
                Cambiar contraseña
              </Button>
              <ButtonCustomer onClick={closePasswordModal}
                className="inline-block rounded bg-indigo-600 px-20 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500">
                Volver
              </ButtonCustomer>
            </div>

          </form>

        </div>
      </Modal>
    </>
  );
};

export default ResetPassword;
