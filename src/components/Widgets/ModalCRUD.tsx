import React from 'react';

import styles from '../../styles/Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const ModalCRUD: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-x-hidden bg-black/50 outline-none focus:outline-none"
    >
      <div
        className={`${styles.modalContent} ml-20 mr-5`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalCRUD;
