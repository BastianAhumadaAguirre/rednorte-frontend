// src/components/common/Table.jsx
export const Table = ({ columnas, datos, renderFila }) => {
  if (!datos || datos.length === 0) {
    return (
      <div className='bg-white rounded-xl shadow-sm p-8 text-center text-gray-500'>
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <table className='w-full'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            {columnas.map((columna, index) => (
              <th
                key={index}
                className='text-left px-6 py-3 text-sm font-medium text-gray-500'
              >
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {datos.map((fila, index) => renderFila(fila, index))}
        </tbody>
      </table>
    </div>
  );
};