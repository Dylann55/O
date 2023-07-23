// components/Sidebar.tsx
import React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { AuthStateSocial } from '@/utils/DBFuntion';
import { checkSession, removeSession } from '@/utils/LocalStorage';
import Link from 'next/link';

const navigationUser = [
    {
        id: 1,
        label: "Perfil",
        url: "/Perfil",
        icon: (
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
        ),
        spanClassName: "translate-x-16",
    },
    {
        id: 2,
        label: "Administrador",
        url: "/Administrador/Invite",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
        spanClassName: "translate-x-24",
    },
];

const navigation = [
    {
        id: 1,
        label: "Jefe",
        url: "/Jefe/Empresa",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
        ),
        spanClassName: "translate-x-16",
    },
    {
        id: 2,
        label: "Chofer",
        url: "/Chofer/",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
        spanClassName: "translate-x-16",
    },
    {
        id: 3,
        label: "General",
        url: "/general",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
        spanClassName: "translate-x-16",
    },
    {
        id: 4,
        label: "General",
        url: "/general",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
        ),
        spanClassName: "translate-x-16",
    },
];


const Sidebar: React.FC = () => {

    // Inicializo un clase para las funciones de la base de datos
    const instanciaAuthStateSocial = new AuthStateSocial();
    const router = useRouter();

    useEffect(() => {
        instanciaAuthStateSocial.checkSessionSocial();

        if (!checkSession()) {
            router.push('/');
        }
    }, []);

    // Si el usuario no cerro la sesion refrescara la pagina
    const CloseSession = async () => {
        await removeSession();
    };
    

    return (
        <div className="fixed top-0 left-0 h-full w-16 bg-neutral-900 border-e flex flex-col justify-between"
            style={{ zIndex: 9999 }}>
            <div>
                <div className="inline-flex h-16 w-16 items-center justify-center">
                    <span className="grid h-10 w-10 place-content-center rounded-lg bg-gray-900 text-xs text-gray-300">
                        O
                    </span>
                </div>

                <div className="border-t border-gray-100">
                    <div className="px-2">
                        <div className="space-y-1 py-4">
                            {navigationUser.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.url}
                                    className="t group relative flex justify-center rounded bg-gray-900 px-2 py-1.5 text-gray-400 hover:text-white"
                                >
                                    {item.icon}

                                    <span style={{ pointerEvents: "none" }}
                                        className={`${item.spanClassName} absolute start-full top-1/2 -translate-y-1/2  rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100`}>
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <ul className="space-y-1 border-t border-gray-100 pt-4">
                            {navigation.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.url}
                                        className="group relative flex justify-center rounded px-2 py-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
                                    >
                                        {item.icon}

                                        <span style={{ pointerEvents: "none" }}
                                            className={`${item.spanClassName} absolute start-full top-1/2 -translate-y-1/2 translate-x-16 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-zinc-900 p-2">
                <form onSubmit={CloseSession}>
                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-100 hover:bg-gray-800 hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>

                        <span className="absolute start-full top-1/2 -translate-y-1/2 translate-x-16 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                            Cerrar Sesion
                        </span>

                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sidebar;
