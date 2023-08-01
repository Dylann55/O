//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import MyProfilesCRUD from '@/components/CRUD/MyProfilesCRUD';
import TransportVM from '@/components/Widgets/VerticalMenu/Transport';

export default function Organization() {

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/users/data/participations',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <TransportVM />

                    <MyProfilesCRUD urls={myUrls} title={'Bienvenido a mis Participaciones'} subtitle={'CRUD de Usuario'} role={true} />
                </div>
            </div>
        </>
    );
}