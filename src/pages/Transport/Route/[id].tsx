//import Router from 'next/router';
import RouteCRUD from '@/components/CRUD/Map/RouteCRUD';
import Sidebar from '@/components/Widgets/Sidebar';
import TransportVM from '@/components/Widgets/VerticalMenu/Transport';

import { useRouter } from 'next/router';

export default function Routes() {

    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/driver/trips/startTrip',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/driver/trips/finishTrip',
        'Transport'
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <TransportVM />
                    <RouteCRUD urls={myUrls} title={`Bienvenido a la Ruta ${name}`} subtitle={''} />
                </div>
            </div>
        </>
    );
}