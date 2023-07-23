import React, { useState } from 'react';

interface MenuItem {
  label: string;
  href: string;
  icon?: JSX.Element;
  subMenu?: MenuItem[];
}

interface NestedListProps {
  menu: MenuItem[];
}

const NestedList: React.FC<NestedListProps> = ({ menu }) => {
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);

  const handleSubMenuClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Evitar que el evento se propague al ítem padre
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <ul className="relative bg-white space-y-">
      {menu.map((item, index) => (
        <li key={index}>
          {item.subMenu ? (
            <details
              className={`group [&_summary::-webkit-details-marker]:hidden relative ${
                openSubMenuIndex === index ? 'open' : ''
              }`}
              onClick={(e) => handleSubMenuClick(index, e)}
            >
              <summary
                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="text-sm font-medium">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
                <span className="shrink-0 transition duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      openSubMenuIndex === index ? 'transform rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4 absolute bg-white rounded-lg shadow-md z-10">
                <NestedList menu={item.subMenu} /> {/* Renderizar submenú anidado */}
              </ul>
            </details>
          ) : (
            <a
              href={item.href}
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NestedList;
