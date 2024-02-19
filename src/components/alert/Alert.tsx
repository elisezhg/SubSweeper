import './Alert.scss';

interface AlertProps {
  type: 'success' | 'error';
  children: React.ReactNode;
}

export default function Alert(props: AlertProps) {
  const { type, children } = props;

  return <div className={`alert alert--${type}`}>{children}</div>;
}
