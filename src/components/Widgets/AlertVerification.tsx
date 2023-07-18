import React, { useEffect } from 'react';

type AlertVerificationProps = {
  message: string;
  onClose: () => void;
};

const AlertVerification: React.FC<AlertVerificationProps> = ({ message, onClose }) => {
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
    <div className="z-50 fixed inset-0 flex items-center justify-center" onClick={handleContainerClick}>
      <div
        role="alert"
        className="fixed top-0 right-0 p-4 m-4 rounded-xl border border-gray-100 bg-white
        bg-primary-lightest transition-transform duration-300 transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring"
      >
        <div className="flex items-start gap-4">
          <span className="text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>

          <div className="flex-1">
            <strong className="block font-medium text-gray-900"> Mensaje de Verificacion </strong>

            <p className="mt-1 text-sm text-gray-700">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertVerification;
