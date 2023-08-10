import Head from 'next/head';
import NestedList from "./VerticalMenu";

const menu = [
    {
        label: 'Transporte',
        href: '',
        subMenu: [
            {
                label: 'Mis Participaciones',
                href: '/Transport/MyParticipation',
            },
        ],
    },
];

export default function TransportVM() {

    return (
        <>
            <Head>
                <title>Transporte</title>
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