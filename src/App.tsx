import AlertsContainer from '@components/alerts-container/AlertsContainer';
import { AlertsProvider } from '@contexts/AlertsProvider';
import Login from '@pages/login/Login';
import SubManager from '@pages/sub-manager/SubManager';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import './App.scss';

const router = createBrowserRouter([
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
]);

function App() {
  return (
    <AlertsProvider>
      <AlertsContainer />
      <div className='main-container'>
        <h1>SubSweeper 🧹</h1>
        <RouterProvider router={router} />
      </div>
    </AlertsProvider>
  );
}

export default App;
