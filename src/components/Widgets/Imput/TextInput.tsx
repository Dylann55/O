import React, { ChangeEvent } from 'react';

interface TextInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        id={value}
        value={value || ''}
        onChange={handleChange}
        className="w-full h-10 rounded-lg border-gray-200 p-4 text-sm shadow-sm"
        placeholder={placeholder}
      />

      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
          />
        </svg>
      </span>
    </div>
  );
};

export default TextInput;
