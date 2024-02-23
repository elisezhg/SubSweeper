import { AlertType } from '@components/alert/Alert';
import { createContext, useContext } from 'react';

export interface Alert {
  type: AlertType;
  message: string;
  isDisplayed: boolean;
  id?: string;
}

interface AlertsContext {
  alerts: Alert[];
  pushAlert: (alert: Alert) => void;
  removeAlert: (alert: Alert) => void;
}

export const AlertsContext = createContext({} as AlertsContext);

export const useAlerts = () => {
  return useContext(AlertsContext);
};
