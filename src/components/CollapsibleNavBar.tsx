import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Logo } from './Logo';
import VerticalNavigation from './Navigation/Vertical';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const CollapsibleNavBar = (props: IMainProps) => {
  const [CollapsedNavBar, SetCollapsedNavBar] = useState(true);
  const [HoveredNavBar, SetHoveredNavBar] = useState(false);

  return (
    <>
      <div
        className=" flex h-screen w-screen overflow-y-hidden bg-slate-100"
        aria-label="Sidebar"
      >
        <div
          className={`h-full overflow-y-hidden bg-uta-primary pt-4 ${
            CollapsedNavBar
              ? 'w-64'
              : 'w-8 min-w-min transition-[width] duration-100 hover:w-64'
          }`}
          onMouseEnter={() => SetHoveredNavBar(true)}
          onMouseLeave={() => SetHoveredNavBar(false)}
        >
          <div className="mt-4 mb-8 grid h-8 w-full grid-cols-6">
            {CollapsedNavBar || HoveredNavBar ? (
              <Link href="/" className="col-span-5 mx-[20px]" passHref>
                <Logo />
              </Link>
            ) : (
              <Link href="/" className="col-span-6 m-auto" passHref>
                <Logo />
              </Link>
            )}

            <div
              className={`mr-4 w-8 justify-self-end ${
                HoveredNavBar || CollapsedNavBar ? '' : 'hidden'
              }`}
              onClick={() => SetCollapsedNavBar(!CollapsedNavBar)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 8 8"
                {...props}
                className={
                  CollapsedNavBar
                    ? 'fill-uta-tertiary hover:fill-none'
                    : 'fill-none hover:fill-uta-tertiary'
                }
              >
                <circle
                  cx={4}
                  cy={4}
                  r={2}
                  style={{
                    stroke: '#cccccc',
                    strokeMiterlimit: 10,
                    strokeWidth: 0.5,
                  }}
                />
              </svg>
            </div>
          </div>
          <VerticalNavigation
            collapsed={CollapsedNavBar}
            hover={HoveredNavBar}
          />
        </div>
        <div>
          <div className={`bg-slate-100`}>
            <div
              className={`h-screen overflow-auto p-8 ${
                CollapsedNavBar || HoveredNavBar
                  ? 'w-[calc(100vw-16rem)]'
                  : 'w-[calc(100vw-5rem)]'
              }`}
            >
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CollapsibleNavBar };
