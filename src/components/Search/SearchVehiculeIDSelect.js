import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SearchVehiculeIDSelect = ({ items, setItemID }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const options = items.map((item) => ({
      value: item.vehicleID,
      label: item.patent,
    }));

    setOptions(options);
  }, [items]);

  return (
    <>
      <div className="relative flex items-center">
        <Select
          id="id"
          className="h-10 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
          options={options}
          onChange={(selectedOption) => {
            if (selectedOption && selectedOption.value !== null) {
              setItemID(Number(selectedOption.value));
            } else {
              setItemID(-1); // O una acción apropiada en caso de no seleccionar ninguna opción
            }
          }}
          isClearable
          placeholder="Seleccione Patente del Vehiculo"
        />
      </div>
    </>
  );
};

export default SearchVehiculeIDSelect;
