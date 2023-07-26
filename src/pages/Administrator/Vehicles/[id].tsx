//import Router from 'next/router';
import VehicleCRUD from '@/components/CRUD/VehicleCRUD';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import { useRouter } from 'next/router';

export default function Transport() {
    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/listTransport',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/createTransport',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/updateTransport',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/deleteTransport',
      ];


    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a {name}</h2>
                        <h2>CRUD de Vehiculos</h2>
                    </div>
                    <VehicleCRUD urls={myUrls}/>
                </div>
            </div>
        </>
    );
}