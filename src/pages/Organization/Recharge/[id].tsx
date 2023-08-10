//import Router from 'next/router';
import RechangeCRUD from '@/components/CRUD/RechangeCRUD';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';

import { useRouter } from 'next/router';

export default function Routes() {

    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/recharges',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/recharges',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/recharges',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/recharges',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/recharges/upload',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <RechangeCRUD urls={myUrls} title={`Bienvenido a ${name}`} subtitle={'CRUD de Vehiculos'} role={false} />
                </div>
            </div>
        </>
    );
}