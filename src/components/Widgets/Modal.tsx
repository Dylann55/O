import React from 'react';

import styles from '../../styles/Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`${styles.modalOverlay} ${styles.backgroundOverlay} md:${styles.modalOverlay}`}
    >
      <div
        className={`${styles.modalContent} translate-y-1/4 md:translate-y-0`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
