import Alert from '@components/alert/Alert';
import { useAlerts } from '@contexts/AlertsContext';
import { createPortal } from 'react-dom';
import './AlertsContainer.scss';

export default function AlertsContainer() {
  const { alerts, removeAlert } = useAlerts();

  return (
    <>
      {createPortal(
        <div className='alerts-container'>
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              type={alert.type}
              isDisplayed={alert.isDisplayed}
              onClose={() => removeAlert(alert)}
            >
              {alert.message}
            </Alert>
          ))}
        </div>,
        document.getElementById('alerts-container-slot')!
      )}
    </>
  );
}
