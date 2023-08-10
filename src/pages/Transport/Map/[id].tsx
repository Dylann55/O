//import Router from 'next/router';
import MapRouteCRUD from '@/components/CRUD/Map/MapRoute';
import Sidebar from '@/components/Widgets/Sidebar';
import TransportVM from '@/components/Widgets/VerticalMenu/Transport';

import { useRouter } from 'next/router';

export default function Routes() {
    const router = useRouter();
    const { name } = router.query;
    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/driver/trips/road',
    ];
    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                <TransportVM />
                    <MapRouteCRUD urls={myUrls} title={`Bienvenido a ${name}`} subtitle={'CRUD de Rutas'} />
                </div>
            </div>
        </>
    );
}