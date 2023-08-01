//import Router from 'next/router';
import Sidebar from '@/components/Widgets/Sidebar';
import OrganizationVM from '@/components/Widgets/VerticalMenu/OrganizationVM';

import { useRouter } from 'next/router';

export default function Routes() {

    const router = useRouter();
    const { name } = router.query;

    const myUrls = [
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/profileUsers/RolesView',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/profileUsers',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/profileUsers/all',
        process.env.NEXT_PUBLIC_MIDDLE_URL + '/manage/profileUsers/inviteDriver',
        'Organization',
    ];

    return (
        <>
            <div className='ml-16'>
                <Sidebar />
                <div className='gap-4'>
                    <OrganizationVM />

                </div>
            </div>
        </>
    );
}