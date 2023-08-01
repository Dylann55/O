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

                    <UserAdminCRUD />
                </div>
            </div>
        </>
    );
}