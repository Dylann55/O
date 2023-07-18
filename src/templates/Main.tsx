import Link from 'next/link';
import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <>
    <div
      className=" flex h-screen w-screen grow overflow-y-auto"
      aria-label="Sidebar"
    >
      <div className="h-full w-64 min-w-min overflow-y-auto bg-uta-primary py-4 px-3 dark:bg-uta-primary">
        <div className="grid grid-cols-4 p-2">
          <Link href="/" className="col-span-3">
            <img
              src="https://www.uta.cl/wp-content/uploads/2018/11/logo_web_uta.png"
              alt="logo"
            ></img>
          </Link>

          <div className="w-8 justify-self-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8 8"
              {...props}
            >
              <circle
                cx={4}
                cy={4}
                r={3}
                style={{
                  stroke: '#cccccc',
                  fill: 'none',
                  strokeMiterlimit: 10,
                  strokeWidth: 0.5,
                }}
              />
            </svg>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="/herramientas"
              className="flex items-center rounded p-2 font-normal text-white hover:bg-uta-tertiary hover:text-black"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 shrink-0 transition duration-75 dark:text-white dark:group-hover:text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span className="ml-3 flex-1 whitespace-nowrap">
                Herramientas
              </span>
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </li>
        </ul>
      </div>
      <div className="w-full overflow-y-auto bg-gray-300">
        <div className=" overflow-auto p-8">{props.children}</div>
      </div>
    </div>
  </>
);

export { Main };
