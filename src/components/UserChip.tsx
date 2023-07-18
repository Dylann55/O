import { Menu, Transition } from '@headlessui/react';
import type { Session } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { Fragment } from 'react';

type ChipProps = {
  username: string;
  avatar: string | null;
  session: Session;
};

export default function UserChip(props: ChipProps) {
  const supabase = useSupabaseClient();
  return (
    <div className="flex justify-self-end">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>
            <div className="flex justify-self-end">
              <span className="ease flex w-max cursor-pointer rounded-full bg-uta-tertiary/80 text-sm font-semibold text-white transition duration-300 hover:bg-uta-tertiary/60 active:bg-gray-300">
                <span className="flex flex-row items-center py-2 pr-2 pl-5">
                  {props.username}
                </span>
                {props.avatar ? (
                  <img
                    className="h-10 w-10 max-w-none self-center rounded-full p-1"
                    alt="User Avatar"
                    src={props.avatar}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-10 w-10"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className=" absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none">
            <div className="p-1">
              <Menu.Item>
                <Link
                  className={`group flex w-full items-center rounded-md p-2 text-sm text-gray-900 hover:bg-uta-tertiary`}
                  href={`/perfil/${props.session.user.id}`}
                  passHref
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 pr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>

                  <p>Mi Cuenta</p>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <button
                  className={`group flex w-full items-center rounded-md p-2 text-sm text-gray-900 hover:bg-uta-tertiary`}
                  onClick={() => supabase.auth.signOut()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 pr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  Cerrar Sesión
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
