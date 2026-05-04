import { useState, useEffect } from 'react';
import { listaEsperaService } from '../../services/listaEsperaService';
import { PosicionEspera } from '../../components/paciente/PosicionEspera';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { cargarSolicitudes(); }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await listaEsperaService.getAll();
      setSolicitudes(data);
    } catch {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  const pendientes = solicitudes.filter(s => s.estado === 'PENDIENTE');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis solicitudes</h1>
        <button
          onClick={() => navigate('/paciente/nueva-solicitud')}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nueva solicitud
        </button>
      </div>

      {pendientes.map(s => (
        <PosicionEspera
          key={s.id}
          posicion={s.posicion ?? 1}
          total={s.totalEspera ?? 1}
          especialidad={s.especialidad}
        />
      ))}

      {solicitudes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          No tienes solicitudes registradas
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Especialidad</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Prioridad</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitudes.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">#{s.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.especialidad}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      s.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-800' :
                      s.estado === 'ASIGNADO'  ? 'bg-blue-100 text-blue-800' :
                      s.estado === 'ATENDIDO'  ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-700'
                    }`}>{s.estado}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {s.prioridad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.fechaIngreso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};