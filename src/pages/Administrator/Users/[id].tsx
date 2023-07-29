//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import UsersCRUD from '@/components/CRUD/UsersCRUD';

import { useRouter } from 'next/router';

export default function Users() {

    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/listProfileUserOrganization',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/createProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/deleteAllProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/CreateUser',
        'Administrator',
    ];

    const myUrls_Role = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/listProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/createProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/deleteProfileUser',
    ];


    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a {name}</h2>
                        <h2>CRUD de Usuarios</h2>
                    </div>
                    <UsersCRUD urls={myUrls} urlsRole={myUrls_Role} />
                </div>
            </div>
        </>
    );
}