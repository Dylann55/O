//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import AdministradorVM from '@/components/Widgets/VerticalMenu/AdministradorVM';
import UserAdminCRUD from '@/components/CRUD/UsersAdminCRUD';

export default function Organization() {

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <AdministradorVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido al Panel de Administracion</h2>
                        <h2>CRUD de Usurios</h2>
                    </div>
                    <UserAdminCRUD />
                </div>
            </div>
        </>
    );
}