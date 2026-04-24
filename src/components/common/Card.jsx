// src/components/common/Card.jsx
export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  );
};