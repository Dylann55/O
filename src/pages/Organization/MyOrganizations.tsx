//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import OrganizationCRUD from '@/components/CRUD/OrganizationCRUD';

export default function Organization() {
    
    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/listMycompanies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/createCompany',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/renameCompany',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/deleteCompany',
        'Organization',
      ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    <div className='flex justify-between p-2 sm:p-10'>
                        <h2>Bienvenido a mis Organizaciones</h2>
                        <h2>CRUD de Organizacion</h2>
                    </div>
                    <OrganizationCRUD urls={myUrls}/>
                </div>
            </div>
        </>
    );
}