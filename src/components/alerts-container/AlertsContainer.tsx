import Alert from '@components/alert/Alert';
import { useAlerts } from '@contexts/AlertsContext';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './AlertsContainer.scss';

export default function AlertsContainer() {
  const { alerts, pushAlert, removeAlert } = useAlerts();

  // TODO: for testing purposes
  useEffect(() => {
    pushAlert({ type: 'success', message: 'hello world' });
    pushAlert({ type: 'error', message: 'hello world' });
  }, []);

  return (
    <>
      {createPortal(
        <div className='alerts-container'>
          {alerts.map((alert) => (
            <Alert type={alert.type} onClose={() => removeAlert(alert)}>
              {alert.message}
            </Alert>
          ))}
        </div>,
        document.getElementById('alerts-container-slot')!
      )}
    </>
  );
}
