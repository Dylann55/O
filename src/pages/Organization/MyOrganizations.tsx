//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';
import OrganizationCRUD from '@/components/CRUD/OrganizationCRUD';

export default function Organization() {

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/users/companies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/users/companies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/companies',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/companies',
        'Organization',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />
                    
                    <OrganizationCRUD urls={myUrls} title={'Bienvenido a mis Organizaciones'} subtitle={'CRUD de Organizacion'}  />
                </div>
            </div>
        </>
    );
}