import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { listaEsperaService } from '../../services/listaEsperaService';
import { citaService } from '../../services/citaService';
import { reasignacionService } from '../../services/reasignacionService';
import { AlertaReasignacion } from '../../components/paciente/AlertaReasignacion';
import { toast } from 'sonner';

export const PacienteDashboard = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [ofertasPendientes, setOfertasPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [solicitudesData, citasData, ofertasData] = await Promise.all([
        listaEsperaService.getAll(),
        citaService.getAll(),
        reasignacionService.getPendientes(),
      ]);
      setSolicitudes(solicitudesData);
      setCitas(citasData);
      setOfertasPendientes(ofertasData);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const proximaCita = citas.find(c => c.estado === 'PROGRAMADA' || c.estado === 'CONFIRMADA');
  const citasRealizadas = citas.filter(c => c.estado === 'REALIZADA').length;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Bienvenido, {user?.email}
      </h1>

      {ofertasPendientes.map(oferta => (
        <AlertaReasignacion
          key={oferta.id}
          oferta={oferta}
          onRespuesta={cargarDatos}
        />
      ))}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <p className="text-xs font-medium text-gray-500">En lista de espera</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {solicitudes.filter(s => s.estado === 'PENDIENTE').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">solicitudes activas</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <p className="text-xs font-medium text-gray-500">Próxima cita</p>
          {proximaCita ? (
            <>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {new Date(proximaCita.fechaHoraCita).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {proximaCita.especialidad} · {proximaCita.nombreMedico}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Sin citas próximas</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <p className="text-xs font-medium text-gray-500">Citas realizadas</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{citasRealizadas}</p>
          <p className="text-xs text-gray-400 mt-1">historial total</p>
        </div>
      </div>

      {proximaCita && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-blue-600 mb-1">Próxima cita confirmada</p>
          <p className="text-sm font-semibold text-blue-900">
            {proximaCita.especialidad} — {proximaCita.nombreMedico}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {new Date(proximaCita.fechaHoraCita).toLocaleDateString('es-CL', {
              weekday: 'long', day: 'numeric', month: 'long'
            })} · {new Date(proximaCita.fechaHoraCita).toLocaleTimeString('es-CL', {
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Solicitudes recientes</h3>
        </div>
        {solicitudes.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">Sin solicitudes registradas</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Especialidad</th>
                <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Estado</th>
                <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Posición</th>
                <th className="text-left px-5 py-2 text-xs font-medium text-gray-500">Fecha ingreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {solicitudes.slice(0, 3).map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm text-gray-800">{s.especialidad}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      s.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-800' :
                      s.estado === 'ASIGNADO'  ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>{s.estado}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {s.posicion ? `${s.posicion} / ${s.totalEspera}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{s.fechaIngreso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};