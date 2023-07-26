//import Router from 'next/router';
import CustomButton from '@/components/Widgets/Button/CustomButton';
import Sidebar from '@/components/Widgets/Sidebar';

export default function Profile() {

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
                            <blockquote className="rounded-lg bg-gray-100 p-8">
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Man"
                                        src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                                        className="h-16 w-16 rounded-full object-cover"
                                    />

                                    <div>
                                        <div className="flex justify-start gap-0.5 text-green-500">
                                            <p className="line-clamp-2 sm:line-clamp-none mt-4 text-gray-500">
                                                Lorem ipsum dolor
                                            </p>
                                        </div>

                                        <p className="line-clamp-2 sm:line-clamp-none mt-1 text-lg font-medium text-gray-700">
                                            Lorem ipsum
                                        </p>
                                        <p className="line-clamp-2 sm:line-clamp-none mt-0 text-gray-500">
                                            Lorem ipsum dolor
                                        </p>
                                    </div>
                                </div>

                                <div className='flex justify-center gap-6 mt-2'>
                                    <CustomButton type="button"
                                        color="indigo"
                                        x="20"
                                        smx="20"
                                        mdx="20"
                                        y="2.5"
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
            </div>
        </>
    );
}