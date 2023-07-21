import clsx from 'clsx';
import React from 'react';

type ButtonCircleProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const ButtonCustomer: React.FC<ButtonCircleProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button type="button" className={clsx(className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonCustomer;
