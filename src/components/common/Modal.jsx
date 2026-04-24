// src/components/common/Modal.jsx
export const Modal = ({ titulo, children, onCerrar }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl shadow-xl w-full max-w-lg mx-4'>
        <div className='flex justify-between items-center px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-800'>{titulo}</h2>
          <button
            onClick={onCerrar}
            className='text-gray-400 hover:text-gray-600 text-xl font-bold'
          >
            ✕
          </button>
        </div>
        <div className='px-6 py-4'>
          {children}
        </div>
      </div>
    </div>
  );
};