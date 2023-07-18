import { Squares2X2Icon } from '@heroicons/react/24/outline';

const navigation = [
  {
    name: 'Herramientas',
    href: '/herramientas',
    icon: Squares2X2Icon,
    current: false,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function VerticalNavigation(props: {
  collapsed: Boolean;
  hover: Boolean;
}) {
  return (
    <nav className="space-y-1" aria-label="Sidebar">
      {navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={classNames(
            item.current
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex items-center px-6 py-2 text-sm font-medium rounded-md'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          <item.icon
            className={classNames(
              item.current
                ? 'text-gray-500'
                : 'text-gray-400 group-hover:text-gray-500',
              'flex-shrink-0 h-6 w-6 ',
              props.hover || props.collapsed ? 'mr-3 ' : ''
            )}
            aria-hidden="true"
          />
          {props.hover || props.collapsed ? (
            <span className="truncate">{item.name}</span>
          ) : (
            ''
          )}
        </a>
      ))}
    </nav>
  );
}
