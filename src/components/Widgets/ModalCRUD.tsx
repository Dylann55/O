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
      className={`${styles.modalOverlay} md:${styles.modalOverlay}`}
    >
      <div
        className={`${styles.modalContent}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalCRUD;
