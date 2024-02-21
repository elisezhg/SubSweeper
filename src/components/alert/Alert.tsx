import './Alert.scss';

export type AlertType = 'success' | 'error';

interface AlertProps {
  type: AlertType;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Alert(props: AlertProps) {
  const { type, onClose, children } = props;

  return (
    <div className={`alert alert--${type}`}>
      <span className='alert__close-btn' onClick={onClose} tabIndex={0} />
      {children}
    </div>
  );
}
