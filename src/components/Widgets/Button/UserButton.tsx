import React, { useState } from 'react';
import CustomButton from './CustomButton';

const UserButton = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
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
                <div className="ml-3 absolute start-full top-1/2 -translate-y-1/2 translate-x-12 mt-2 w-auto py-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-neutral-900 dark:border-gray-600">
                    <blockquote className="px-4">
                        <div className="flex items-center gap-4">
                            <img
                                alt="Man"
                                src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                                className="h-16 w-16 rounded-full object-cover"
                            />

                            <div>
                                <div className="flex justify-start gap-0.5 text-green-500">
                                    <p className="mt-4 text-sm text-gray-900 dark:text-white">
                                        Lorem ipsum dolor
                                    </p>
                                </div>

                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                    Lorem ipsum
                                </p>
                                <p className="mt-0 text-sm text-gray-900 dark:text-white">
                                    Lorem ipsum dolor
                                </p>
                            </div>
                        </div>

                        <div className='flex justify-center m-1'>
                            <CustomButton type="button"
                                color="indigo"
                                x="20"
                                smx="20"
                                mdx="20"
                                y="1.5"
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
                </div>
            )}
        </div>
    );
};

export default UserButton;
