//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import AdministradorVM from '@/components/Widgets/VerticalMenu/AdministradorVM';
import OrganizationCRUD from '@/components/CRUD/OrganizationCRUD';

export default function Organization() {

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/companies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/companies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/companies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/companies',
        'Administrator',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <AdministradorVM />

                    <OrganizationCRUD urls={myUrls} title={'Bienvenido a Panel de Administracion'} subtitle={'CRUD de Organizacion'}  />
                </div>
            </div>
        </>
    );
}