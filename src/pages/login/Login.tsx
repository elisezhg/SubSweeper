import Button from '@components/button/Button';
import './Login.scss';

export default function Login() {
  return (
    <div className='login-page'>
      <p>To start the sweeping process, please log in to Reddit first!</p>
      <Button className='login-page__login-btn'>Log In</Button>
    </div>
  );
}
