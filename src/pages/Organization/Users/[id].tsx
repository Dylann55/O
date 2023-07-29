//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import UsersCRUD from '@/components/CRUD/UsersCRUD';

import { useRouter } from 'next/router';

export default function Users() {

    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/userOrganizationRoles',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/createProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/deleteAllProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/registerUser',
        'Organization',
    ];

    const myUrls_Role = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/listMyParticipationCompany',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/createProfileUser',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/deleteProfileUser',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a {name}</h2>
                        <h2>CRUD de Perfiles</h2>
                    </div>
                    <UsersCRUD urls={myUrls} urlsRole={myUrls_Role} />
                </div>
            </div>
        </>
    );
}