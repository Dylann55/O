//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import AdministradorVM from '@/components/Widgets/VerticalMenu/AdministradorVM';
import OrganizationCRUD from '@/components/CRUD/OrganizationCRUD';

export default function Organization() {

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/listCompany',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/createCompany',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/updateCompany',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/sysadmin/deleteCompany',
        'Administrator',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <AdministradorVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a Panel de Administracion</h2>
                        <h2>CRUD de Organizacion</h2>
                    </div>
                    <OrganizationCRUD urls={myUrls} />
                </div>
            </div>
        </>
    );
}