//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import UsersCRUD from '@/components/CRUD/UsersCRUD';

import { useRouter } from 'next/router';

export default function Users() {

    const router = useRouter();
    const { name } = router.query;

    const myUrls = [    
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/profileUsers/organization/RolesView',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/profileUsers',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/profileUsers',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/CreateUser',
        'Administrator',
    ];

    const myUrls_Role = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/profileUsers',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/profileUsers',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/deleteProfileUser',
    ];


    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />

                    <UsersCRUD urls={myUrls} urlsRole={myUrls_Role} title={`Bienvenido a ${name}`} subtitle={'CRUD de Usuarios'} />
                </div>
            </div>
        </>
    );
}