import { Squares2X2Icon } from '@heroicons/react/24/outline';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { AuthStateSocial } from '@/utils/DBFuntion';
import { checkSession, removeSession } from '@/utils/LocalStorage';

const navigation = [
  {
    name: 'Admnistrador',
    href: '/Administrador/Invite',
    icon: Squares2X2Icon,
    current: false,
  },
  {
    name: 'Dashboard',
    href: '/Lobby',
    icon: Squares2X2Icon,
    current: false,
  },
];

export default function VerticalSidebar() {

  // Inicializo un clase para las funciones de la base de datos
  const instanciaAuthStateSocial = new AuthStateSocial();
  const router = useRouter();

  useEffect(() => {
    instanciaAuthStateSocial.checkSessionSocial();

    if (!checkSession()) {
      router.push('/');
    }
  }, []);

  const CloseSession = () => {
    removeSession();
    window.location.href = '/';
  };

  return (
    <>
      <div className="flex h-screen w-16 flex-col justify-between border-e bg-white">

        <div className="inline-flex h-16 w-16 items-center justify-center">
          <span
            className="grid h-10 w-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"
          >
            L
          </span>
        </div>
        <div className="border-t border-gray-100">
          <div className="px-2">

            {navigation.map((item) => (
              <div className="py-4">
                <a
                  key={item.name}
                  href={item.href}
                  className='t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700'
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon
                    className="h-5 w-5 opacity-75"
                    aria-hidden="true"
                  />
                  <span className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                    {item.name}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
          <form onSubmit={CloseSession}>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>

              <span
                className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
              >
                Logout
              </span>
            </button>
          </form>
        </div>
      </div>
    </>


  );
}
