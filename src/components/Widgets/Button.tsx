import clsx from 'clsx';
import React from 'react';

type ButtonProps = {
  onClick: (event: any) => void;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button type="button" className={clsx(className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
