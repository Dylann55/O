import React from 'react';

import styles from '../../styles/Modal.module.css';

type ModalPasswordProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const ModalPassword: React.FC<ModalPasswordProps> = ({ isOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-x-hidden bg-black/70 outline-none focus:outline-none"
    >
      <div
        className={`${styles.modalContent}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalPassword;
