import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertsContext } from './AlertsContext';

interface AlertsProviderProps {
  children: React.ReactNode;
}

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const [alerts, setAlerts] = useState([] as Alert[]);

  // TODO: add pushSuccessAlert and pushErrorAlert

  const pushAlert = (alert: Alert) => {
    const alertWithId = { ...alert, id: uuidv4() };
    setAlerts((alerts) => [...alerts, alertWithId]);
    setTimeout(() => removeAlert(alert), 3000);
  };

  const removeAlert = (alert: Alert) => {
    const alertToBeRemoved = {
      ...alert,
      isDisplayed: false,
    };
    setAlerts((alerts) =>
      alerts.map((a) => (a === alert ? alertToBeRemoved : a))
    );
    setTimeout(() => {
      setAlerts((alerts) => alerts.filter((a) => a !== alertToBeRemoved));
    }, 300);
  };

  return (
    <AlertsContext.Provider value={{ alerts, pushAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};
