//import Router from 'next/router';
import UserCRUD from '@/components/CRUD/UserCRUD';
import { useEffect } from 'react';
import Sidebar from '@/components/Widgets/Sidebar';
import AdministradorVM from '@/components/Widgets/VerticalMenu/AdministradorVM';


export default function Invite() {

    useEffect(() => {
    }, []);

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <AdministradorVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido al Panel de Admnistracion</h2>
                        <h2>CRUD de Usuarios</h2>
                    </div>
                    <UserCRUD />
                </div>
            </div>
        </>
    );
}