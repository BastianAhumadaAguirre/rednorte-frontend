// src/components/common/Navbar.jsx
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center gap-8'>
            <span
              onClick={() => navigate('/')}
              className='text-xl font-bold text-blue-600 cursor-pointer'
            >
              RedNorte
            </span>
            <div className='hidden md:flex gap-6'>
              <button
                onClick={() => navigate('/paciente/dashboard')}
                className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/paciente/solicitudes')}
                className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
              >
                Mis Solicitudes
              </button>
              <button
                onClick={() => navigate('/paciente/citas')}
                className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
              >
                Mis Citas
              </button>
              <button
                onClick={() => navigate('/paciente/perfil')}
                className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
              >
                Mi Perfil
              </button>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-600'>{user?.email}</span>
            <button
              onClick={handleLogout}
              className='text-sm text-red-500 hover:text-red-700 font-medium transition-colors'
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};