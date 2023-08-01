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
            <div className='flex justify-between mt-2 mx-2'>
                <NestedList menu={menu} />
            </div>
        </>
    );
}