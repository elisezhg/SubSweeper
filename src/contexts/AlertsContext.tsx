import { AlertType } from '@components/alert/Alert';
import { createContext, useContext } from 'react';

export interface Alert {
  type: AlertType;
  message: string;
  isDisplayed: boolean;
  id?: string;
}

export interface AlertsType {
  [key: string]: Alert;
}

interface AlertsContext {
  alerts: AlertsType;
  pushSuccessAlert: (message: string) => void;
  pushErrorAlert: (message: string) => void;
  removeAlert: (alertId: string) => void;
}

export const AlertsContext = createContext({} as AlertsContext);

export const useAlerts = () => {
  return useContext(AlertsContext);
};
