// src/components/common/Button.jsx
export const Button = ({
  children,
  onClick,
  type = 'button',
  variante = 'primary',
  disabled = false,
  className = '',
}) => {
  const estilos = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-blue-600 border border-blue-600',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 ${estilos[variante]} ${className}`}
    >
      {children}
    </button>
  );
};