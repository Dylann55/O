import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { ReadRequest } from '@/utils/CRUD';

const SearchCurrencyTypeSelect = ({ setItemID }) => {
  const [options, setOptions] = useState([]);
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_MIDDLE_URL + '/users/data/currency';
      const access_token = localStorage.getItem('access_token_Request');

      if (access_token) {
        const config = {
          access_token: access_token,
        };

        const response = await ReadRequest(url, config);
        if (!response.error && !response.errors) {
          setItems(response);
        }
      }
    } catch (error) {
      // Manejo de errores aquí
    }
  };

  useEffect(() => {
    fetchItems();
  }, []); // Dejamos el array de dependencias vacío para que se ejecute solo una vez al montar el componente

  useEffect(() => {
    // Crear las opciones para el Select aquí, cuando 'items' cambie
    const options = items.map((item) => ({
      value: item.abreviation,
      label: item.abreviation,
    }));
    setOptions(options);
  }, [items]);

  return (
    <>
      <div className="relative flex items-center">
        <Select
          id="id"
          className="w-full h-10 rounded-lg border-gray-300 text-gray-700 sm:text-sm"
          options={options}
          onChange={(selectedOption) => {
            if (selectedOption && selectedOption.value !== null) {
              setItemID(selectedOption.value);
            } else {
              setItemID('');
            }
          }}
          isClearable
          placeholder="Seleccione Tipo de Moneda"
        />
      </div>
    </>
  );
};

export default SearchCurrencyTypeSelect;
