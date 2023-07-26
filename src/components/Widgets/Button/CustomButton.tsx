import React from 'react';

interface CustomButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color: 'indigo' | 'red' | 'blue' | 'green' | 'yellow'; // Definimos una lista de colores válidos
  padding_x: string;
  padding_smx: string;
  padding_mdx: string;
  padding_y: string;
  width: string;
  height: string;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  color,
  padding_x,
  padding_smx,
  padding_mdx,
  padding_y,
  width,
  height,
  type = 'button',
  children,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  // Utilizamos el color seleccionado para formar las clases CSS
  const buttonClassName = `w-${width} h-${height} text-white inline-flex items-center justify-center gap-2 rounded border 
  ${color === 'indigo' ? 'border-indigo-600 bg-indigo-600 hover:text-indigo-600' :
      color === 'red' ? 'border-red-600 bg-red-600 hover:text-red-600' :
        'border-gray-600 bg-gray-600 hover:text-gray-600'} 
  px-${padding_x} sm:px-${padding_smx} md:px-${padding_mdx} py-${padding_y} text-sm font-medium hover:bg-transparent focus:outline-none focus:ring`;

  return (
    <button type={type} className={buttonClassName} onClick={handleClick}>
      {children}
    </button>
  );
};

export default CustomButton;
