import { useEffect, useState } from 'react';

const getStatus = () => Boolean(localStorage.getItem('ss-token'));

export default function useLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(getStatus());

  useEffect(() => {
    const updateStatus = () => {
      console.log('updating status to', getStatus());
      setIsLoggedIn(getStatus());
    };
    window.addEventListener('storage', updateStatus);

    return () => window.removeEventListener('storage', updateStatus);
  }, []);

  return { isLoggedIn };
}
