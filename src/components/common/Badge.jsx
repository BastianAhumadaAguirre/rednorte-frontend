// src/components/common/Badge.jsx
export const Badge = ({ texto, tipo = 'default' }) => {
  const estilos = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${estilos[tipo]}`}>
      {texto}
    </span>
  );
};