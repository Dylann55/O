//import Router from 'next/router';
import VehicleCRUD from '@/components/CRUD/VehicleCRUD';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import { useRouter } from 'next/router';

export default function Transport() {
    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/transports',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/transports',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/transports',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/transports',
      ];


    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />

                    <VehicleCRUD urls={myUrls} title={`Bienvenido a ${name}`} subtitle={'CRUD de Vehiculos'}/>
                </div>
            </div>
        </>
    );
}