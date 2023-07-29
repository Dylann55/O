//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import UserCRUD from '@/components/CRUD/UserCRUD';

import { useRouter } from 'next/router';

export default function Users() {

    const router = useRouter();
    const { name, O_Name } = router.query;

    const myUrls = [
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
                        <h2>Bienvenido a {O_Name}</h2>
                        <h2>CRUD de {name}</h2>
                    </div>
                    <UserCRUD urls={myUrls}/>
                </div>
            </div>
        </>
    );
}