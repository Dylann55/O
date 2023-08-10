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
    <div className="flex flex-row items-center justify-center gap-2">
      <p className='flex-2 text-gray-600 text-sm'>{placeholder}</p>
      <div className='flex-1'>
        <div className="relative flex items-center">
          <input
            type="number"
            value={value || 0}
            onChange={handleChange}
            className="h-10 w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm text-gray-600"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
