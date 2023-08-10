import React from 'react';
import CustomButton from './Button/CustomButton';


interface ItemListHeaderProps {
  title: string;
  subtitle: string;
  itemName: string;
  openLoginModal: () => void;
  fetchItems: () => void;
  handleDeleteSelected: () => void;
}

const ItemListHeader: React.FC<ItemListHeaderProps> = ({
  title,
  subtitle,
  itemName,
  openLoginModal,
  fetchItems,
  handleDeleteSelected,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between mb-4">
      <div className="text-center md:text-start">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-gray-900">
          {title}
        </h1>
        <p className="text-md sm:text-sm font-medium text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        <CustomButton
          onClick={openLoginModal}
          type="button"
          color="indigo"
          padding_x="3"
          padding_smx="8"
          padding_mdx="12"
          padding_y="2"
          width="32"
          height="15"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Crear {itemName}
        </CustomButton>

        <CustomButton
          onClick={fetchItems}
          type="button"
          color="indigo"
          padding_x="2"
          padding_smx="2"
          padding_mdx="2"
          padding_y="0"
          width="10"
          height="15"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </CustomButton>

        <CustomButton
          onClick={handleDeleteSelected}
          type="button"
          color="red"
          padding_x="3"
          padding_smx="8"
          padding_mdx="12"
          padding_y="2"
          width="32"
          height="15"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Eliminar {itemName}
        </CustomButton>
      </div>
    </div>
  );
};

export default ItemListHeader;
