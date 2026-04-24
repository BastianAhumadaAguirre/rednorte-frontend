// src/components/common/Sidebar.jsx
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = ({ links }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className='w-64 min-h-screen bg-white border-r border-gray-200 px-4 py-6'>
      <nav className='space-y-1'>
        {links.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link.ruta)}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === link.ruta
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            {link.icono && <span className='mr-2'>{link.icono}</span>}
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};