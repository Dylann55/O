import React, { ReactNode, MouseEvent } from 'react';

interface CustomButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  color: string;
  x: string;
  smx: string;
  mdx: string;
  y: string;
  type?: 'button' | 'submit' | 'reset'; // La propiedad 'type' es opcional y solo acepta estos valores
  children: ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, color, x, smx, mdx, y, type = 'button', children }) => {
  const buttonClassName = `inline-flex items-center gap-2 rounded border border-${color}-600 bg-${color}-600 px-${x} sm:px-${smx} md:px-${mdx} py-${y} text-sm font-medium text-white hover:bg-transparent hover:text-${color}-600 focus:outline-none focus:ring active:text-${color}-500`;

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
    >
      {children}
    </button>
  );
};


export default CustomButton;
