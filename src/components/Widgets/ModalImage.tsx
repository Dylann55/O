import React from 'react';

type AlertVerificationProps = {
  ulrImage: string;
  isOpen: boolean;
  onClose: () => void;
};

const ModalImage: React.FC<AlertVerificationProps> = ({
  ulrImage,
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleContainerClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
      onClick={handleContainerClick}
    >
      <div className="w-full sm:max-w-lg ml-20 sm:ml-10 md:ml-0 mr-5">
        <img
          className="w-full h-auto"
          src={ulrImage}
          alt="Imagen de la Recarga"
        />
      </div>
    </div>
  );
};

export default ModalImage;
