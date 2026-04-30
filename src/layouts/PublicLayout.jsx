import { Outlet } from 'react-router-dom';
import { Footer } from '../components/common/Footer';

export const PublicLayout = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <Outlet />
      <Footer />
    </div>
  );
};