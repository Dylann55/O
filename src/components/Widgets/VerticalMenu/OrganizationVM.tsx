import NestedList from "./VerticalMenu";

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
            <div className='flex justify-between mt-2 mx-2'>
                <NestedList menu={menu} />
            </div>
        </>
    );
}