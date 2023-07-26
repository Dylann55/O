//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import UsersCRUD from '@/components/CRUD/UsersCRUD';

import { useRouter } from 'next/router';

export default function Users() {

    const router = useRouter();
    const { name } = router.query;

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a {name}</h2>
                        <h2>CRUD de Roles</h2>
                    </div>
                    <UsersCRUD />
                </div>
            </div>
        </>
    );
}