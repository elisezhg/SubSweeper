import { useState } from 'react';
import { Alert, AlertsContext } from './AlertsContext';

interface AlertsProviderProps {
  children: React.ReactNode;
}

export const AlertsProvider = ({ children }: AlertsProviderProps) => {
  const [alerts, setAlerts] = useState([] as Alert[]);

  const pushAlert = (alert: Alert) => {
    setAlerts((alerts) => [...alerts, alert]);
  };

  const removeAlert = (alert: Alert) => {
    setAlerts((alerts) => alerts.filter((a) => a !== alert));
  };

  return (
    <AlertsContext.Provider value={{ alerts, pushAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};
