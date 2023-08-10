//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import MapCRUD from '@/components/CRUD/Map/MapCRUD';

import { useRouter } from 'next/router';

export default function Routes() {
    const router = useRouter();
    const { name } = router.query;
    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/trips',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/trips',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/trips/trip',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/trips/typeBurden',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/trips',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/trips',
        'Organization',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/profileUsers/driverProfiles',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/transports'
    ];
    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <MapCRUD urls={myUrls} title={`Bienvenido a ${name}`} subtitle={'CRUD de Viajes'} />
                </div>
            </div>
        </>
    );
}