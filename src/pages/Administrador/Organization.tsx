//import Router from 'next/router';
import { useEffect } from 'react';
import Sidebar from '@/components/Widgets/Sidebar';
import AdministradorVM from '@/components/Widgets/VerticalMenu/AdministradorVM';
import OrganizationCRUD from '@/components/CRUD/OrganizationCRUD';

export default function Organization() {

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
                        <h2>CRUD de Compañia</h2>
                    </div>
                    <OrganizationCRUD />
                </div>
            </div>
        </>
    );
}