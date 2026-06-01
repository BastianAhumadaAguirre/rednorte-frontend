import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Navbar arriba también en login/register */}
      <Navbar />

      {/* Contenido centrado (formulario login/register) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};