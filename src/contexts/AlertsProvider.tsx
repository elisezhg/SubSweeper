import { AlertType } from '@components/alert/Alert';
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertsContext, AlertsType } from './AlertsContext';

interface AlertsProviderProps {
  children: React.ReactNode;
}

interface TimeoutsRef {
  [key: string]: NodeJS.Timeout;
}

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const [alerts, setAlerts] = useState({} as AlertsType);
  const timeoutsRef = useRef({} as TimeoutsRef);

  const pushAlert = (type: AlertType, message: string) => {
    const newAlert = { type, message, isDisplayed: true };
    const newAlertId = uuidv4();

    setAlerts((alerts) => ({
      ...alerts,
      [newAlertId]: newAlert,
    }));

    timeoutsRef.current[newAlertId] = setTimeout(() => {
      removeAlert(newAlertId);
    }, 3000);
  };

  const pushSuccessAlert = (message: string) => {
    pushAlert('success', message);
  };

  const pushErrorAlert = (message: string) => {
    pushAlert('error', message);
  };

  const removeAlert = (alertId: string) => {
    setAlerts((alerts) => {
      const updatedAlerts = { ...alerts };
      updatedAlerts[alertId].isDisplayed = false;
      return updatedAlerts;
    });

    setTimeout(() => {
      setAlerts((alerts) => {
        const { [alertId]: alertToRemove, ...restAlerts } = alerts;
        return restAlerts;
      });
    }, 300);

    clearTimeout(timeoutsRef.current[alertId]);
  };

  return (
    <AlertsContext.Provider
      value={{ alerts, pushSuccessAlert, pushErrorAlert, removeAlert }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
