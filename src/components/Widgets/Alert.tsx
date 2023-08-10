import React, { useEffect } from 'react';

type AlertProps = {
  message: string;
  onClose: () => void;
};

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleContainerClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleContainerClick}
    >
      <div
        role="alert"
        className="fixed top-0 right-0 m-4 rounded text-red-700 bg-red-100 p-4
      transition-transform duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring"
      >
        <div className="flex items-center gap-2 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>

          <strong className="block font-medium text-xs sm:text-sm">Mensaje de Error</strong>
        </div>

        <p className="mt-1 text-xs sm:text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Alert;
