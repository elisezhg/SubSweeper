import Button from '@components/button/Button';
import { getRedirectionUrl } from '@utils/redirection';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import LoadingWrapper from '@components/loading-wrapper/LoadingWrapper';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ss-token');

    if (!storedToken) {
      setIsLoading(false);
    } else {
      navigate('/');
    }
  }, []);

  return (
    <LoadingWrapper isLoading={isLoading}>
      <div className='login-page'>
        <p>To start the sweeping process, please log in to Reddit first!</p>
        <Button
          className='login-page__login-btn'
          buttonType='a'
          href={getRedirectionUrl()}
        >
          Log In
        </Button>
      </div>
    </LoadingWrapper>
  );
}
