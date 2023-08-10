import NestedList from "./VerticalMenu";
import Head from 'next/head';

const menu = [
    {
        label: 'Organizacion',
        href: '',
        subMenu: [
            {
                label: 'Mis Organizaciones',
                href: '/Organization/MyOrganizations',
            },
            {
                label: 'Mis Participaciones',
                href: '/Organization/MyParticipation',
            },
        ],
    },
];

export default function OrganizationVM() {

    return (
        <>
            <Head>
                <title>Organizacion</title>
                <meta
                    name="description"
                    content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
                />
            </Head>
            <div className='flex justify-between mt-2 mx-2'>
                <NestedList menu={menu} />
            </div>
        </>
    );
}