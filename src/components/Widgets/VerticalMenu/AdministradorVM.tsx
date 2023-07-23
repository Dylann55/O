import NestedList from "./VerticalMenu";

const menu = [
    {
        label: 'Administrador',
        href: '',
        subMenu: [
            {
                label: 'Compañias',
                href: '/Administrador/Organization',
            },
            {
                label: 'Usuario',
                href: '/Administrador/Invite',
            },
            {
                label: 'Teams',
                href: '',
                subMenu: [
                    {
                        label: 'Banned Users',
                        href: '',
                    },
                    {
                        label: 'Calendar',
                        href: '',
                    },
                ],
            },
            {
                label: 'Invoices',
                href: '',
            },
            {
                label: 'Account',
                href: '',
                subMenu: [
                    {
                        label: 'Details',
                        href: '',
                    },
                    {
                        label: 'Security',
                        href: '',
                    },
                    {
                        label: 'Logout',
                        href: '/logout',
                    },
                ],
            },
        ],
    },
];

export default function AdministradorVM() {

    return (
        <>
            <div className='flex justify-between p-4'>
                <NestedList menu={menu} />
            </div>
        </>
    );
}