import React, { ChangeEvent } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, placeholder }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm text-gray-600"
        placeholder={placeholder}
      />
    </div>
  );
};

export default NumberInput;
