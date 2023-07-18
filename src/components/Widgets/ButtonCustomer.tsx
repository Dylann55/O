import React from 'react';
import clsx from 'clsx';

type ButtonCircleProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const ButtonCustomer: React.FC<ButtonCircleProps> = ({ onClick, children, className }) => {
  
  return (
    <button
      type="button"
      className={clsx(className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonCustomer;
