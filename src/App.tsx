import AlertsContainer from '@components/alerts-container/AlertsContainer';
import Header from '@components/header/Header';
import { AlertsProvider } from '@contexts/AlertsProvider';
import Login from '@pages/login/Login';
import SubManager from '@pages/sub-manager/SubManager';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import './App.scss';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SubManager />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <Navigate to='/' replace />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

function App() {
  return (
    <AlertsProvider>
      <AlertsContainer />
      <Header />
      <div className='main-container'>
        <RouterProvider router={router} />
      </div>
    </AlertsProvider>
  );
}

export default App;
