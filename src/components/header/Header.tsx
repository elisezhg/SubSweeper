import LogoutSVG from '@assets/logout.svg';
import { useAlerts } from '@contexts/AlertsContext';
import useLoggedIn from '@hooks/useLoggedIn';
import './Header.scss';

export default function Header() {
  const { isLoggedIn } = useLoggedIn();
  const { pushSuccessAlert } = useAlerts();

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));

    pushSuccessAlert('Successfully logged out.');
  };

  return (
    <div className='header'>
      <h1 className='header__title'>SubSweeper</h1>
      {isLoggedIn && (
        <button
          type='button'
          className='header__logout-btn'
          aria-label='log out'
          onClick={handleLogout}
        >
          <img src={LogoutSVG} alt='' />
        </button>
      )}
    </div>
  );
}
