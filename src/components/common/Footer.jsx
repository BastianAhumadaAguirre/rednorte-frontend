import { useNavigate } from 'react-router-dom';

const AÑO = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-2'>
          
          {/* contacto  */}
          <div className='flex items-center gap-4'>
            <span className='text-sm font-bold text-blue-600'>RedNorte</span>
            <span className='text-gray-200'>|</span>
            <span className='text-xs text-gray-400'> +56 55 2 123 456</span>
            <span className='text-xs text-gray-400'> contacto@rednorte.cl</span>
          </div>

          {/* Copyright */}
          <p className='text-xs text-gray-400'>
            © {AÑO} RedNorte · Todos los derechos reservados
          </p>

        </div>
      </div>
    </footer>
  );
};