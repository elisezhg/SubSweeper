import React from 'react';
import './Alert.scss';

export type AlertType = 'success' | 'error';

interface AlertProps {
  type: AlertType;
  isDisplayed: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Alert(props: AlertProps) {
  const { type, isDisplayed, onClose, children } = props;

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClose();
    }
  };

  return (
    <div
      className={`alert alert--${type} alert--${isDisplayed ? 'show' : 'hide'}`}
    >
      <span
        className='alert__close-btn'
        onClick={onClose}
        onKeyUp={handleKeyUp}
        tabIndex={0}
      />
      {children}
    </div>
  );
}
