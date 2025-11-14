import { Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

export const App: React.FC = () => {
  return <MainLayout />;
};

export const AppOutlet: React.FC = () => <Outlet />;
