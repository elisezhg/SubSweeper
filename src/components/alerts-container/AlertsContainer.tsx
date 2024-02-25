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
          {Object.keys(alerts).map((alertId) => (
            <Alert
              key={alertId}
              type={alerts[alertId].type}
              isDisplayed={alerts[alertId].isDisplayed}
              onClose={() => removeAlert(alertId)}
            >
              {alerts[alertId].message}
            </Alert>
          ))}
        </div>,
        document.getElementById('alerts-container-slot')!
      )}
    </>
  );
}
