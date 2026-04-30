// src/pages/public/HomePage.jsx
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
      <div className='text-center max-w-2xl px-4'>
        <h1 className='text-4xl font-bold text-blue-600 mb-4'>RedNorte</h1>
        <p className='text-xl text-gray-600 mb-8'>
          Sistema de Gestión de Listas de Espera
        </p>
        <div className='flex gap-4 justify-center'>
          <button
            onClick={() => navigate('/login')}
            className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className='bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-6 rounded-lg border border-blue-600 transition-colors'
          >
            Registrarse
          </button>

          <p className='text-center text-sm text-gray-600 mt-4'>
        ¿Ingreso?{' '}
        <a href='/dashboard' className='text-blue-600 hover:underline'>
          Inicia sesión de prueba (Dev Login)
        </a>
      </p>
        </div>
      </div>
    </div>
  );
};