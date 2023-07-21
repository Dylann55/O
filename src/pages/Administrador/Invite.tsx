//import Router from 'next/router';
import UserCRUD from '@/components/CRUD/UserCRUD';
import { useEffect } from 'react';
import Sidebar from '@/components/Widgets/Sidebar';

export default function Invite() {


    useEffect(() => {
    }, []);

    return (
        <>

            <div className='ml-16 bg-gray-100'>
                <Sidebar />
                <div className='gap-4'>
                    <div className='flex justify-between p-4'>
                        <h2>Bienvenido al Panel de Admnistracion</h2>
                        <h2>CRUD de Usuarios</h2>
                    </div>
                    <UserCRUD />
                </div>
            </div>
        </>
    );
}