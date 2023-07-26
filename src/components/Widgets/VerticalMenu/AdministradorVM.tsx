import { useEffect } from "react";
import NestedList from "./VerticalMenu";
import VerifyUser from "@/utils/VerifyAdministrador";


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
            <div className='flex justify-between p-4'>
                <NestedList menu={menu} />
            </div>
        </>
    );
}