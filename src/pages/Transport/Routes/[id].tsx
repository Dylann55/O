//import Router from 'next/router';
import MyRoutesCRUD from '@/components/CRUD/Trasport/MyRoutesCRUD';
import Sidebar from '@/components/Widgets/Sidebar';
import TransportVM from '@/components/Widgets/VerticalMenu/Transport';

import { useRouter } from 'next/router';

export default function Routes() {

    const router = useRouter();
    const { name} = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/driver/trips',
        'Transport',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <TransportVM />
                    <MyRoutesCRUD urls={myUrls} title={`Bienvenido a ${name}`} subtitle={'CRUD de Vehiculos'} />
                </div>
            </div>
        </>
    );
}