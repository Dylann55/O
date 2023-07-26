//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import MyProfilesCRUD from '@/components/CRUD/MyProfilesCRUD';

export default function Organization() {

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a mis Participaciones</h2>
                        <h2>CRUD de Usuario</h2>
                    </div>
                    <MyProfilesCRUD />
                </div>
            </div>
        </>
    );
}