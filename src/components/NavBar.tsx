import Link from 'next/link';

import ModalLogin from './modal/ModalLogin';

type NavProps = {
  breadcrums: Array<string> | null;
};

const NavBar = (props: NavProps) => {
  return (
    <nav className="grid grid-cols-2 pb-16">
      <div className="fixed inline-table py-2 " aria-label="Breadcrumb">
        <ol className="inline-flex space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Panel
            </Link>
          </li>
          {props.breadcrums
            ? props.breadcrums.map((element) => (
                <li key={element} className="inline-flex">
                  <Link
                    href={`/${element.toLowerCase()}`}
                    className="inline-flex text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {element}
                  </Link>
                </li>
              ))
            : ''}
        </ol>
      </div>
      <div className="fixed right-8 inline-flex justify-self-end">
        <ModalLogin />
      </div>
    </nav>
  );
};

export { NavBar };
