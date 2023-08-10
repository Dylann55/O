import React from 'react';

interface FormHeaderProps {
  updateId: any | null;
  itemName: string;
  h2Text: string;
  pText: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ updateId, itemName, h2Text, pText }) => {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
      </h1>

      <h2 className="text-center text-lg font-medium">{h2Text}</h2>

      <p className="mx-auto mt-4 max-w-md text-center text-gray-500">{pText}</p>
    </div>
  );
};

export default FormHeader;
