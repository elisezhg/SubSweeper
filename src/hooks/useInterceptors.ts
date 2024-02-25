import { useAlerts } from '@contexts/AlertsContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useInterceptors() {
  const navigate = useNavigate();
  const { pushErrorAlert } = useAlerts();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response.status == 401) {
          localStorage.clear();
          navigate('/login');
          pushErrorAlert('Your session has expired, please log in again.');
          return Promise.reject('Unauthorized');
        }

        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);
}
