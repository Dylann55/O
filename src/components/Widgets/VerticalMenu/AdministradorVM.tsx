import { useEffect } from "react";
import NestedList from "./VerticalMenu";
import VerifyUser from "@/utils/VerifyAdministrador";
import Head from 'next/head';

const menu = [
    {
        label: 'Administrador',
        href: '',
        subMenu: [
            {
                label: 'Usuarios',
                href: '/Administrator/Users',

            },
            {
                label: 'Organizaciones',
                href: '/Administrator/Organization',
            },

        ],
    },
];

export default function AdministradorVM() {

    useEffect(() => {
        VerifyUser();
    }, []);

    return (
        <>
            <Head>
                <title>Administrador</title>
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