import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const MutableIcon = (prop: { key: string; onClick: Function }) => {
  const [iconState, setIconState] = useState<number>(0);
  const icons: Array<any> = [
    <TrashIcon key={prop.key} className="w-4"></TrashIcon>,
    <ArrowPathIcon key={prop.key} className="w-4 animate-spin"></ArrowPathIcon>,
  ];

  const icon = (choose: number) => {
    return icons[choose];
  };
  return (
    <>
      <button
        className="w-4"
        onClick={() => {
          setIconState(iconState + 1);
          if (iconState + 1 >= icons.length) {
            setIconState(0);
          }
          prop.onClick();
        }}
      >
        {icon(iconState)}
      </button>
    </>
  );
};

export default MutableIcon;
