import { toast } from 'sonner';
import { reasignacionService } from '../../services/reasignacionService';

export const AlertaReasignacion = ({ oferta, onRespuesta }) => {
  const handleAceptar = async () => {
    try {
      await reasignacionService.responder(oferta.id, true);
      toast.success('Hora aceptada correctamente');
      onRespuesta();
    } catch {
      toast.error('Error al aceptar la hora');
    }
  };

  const handleRechazar = async () => {
    try {
      await reasignacionService.responder(oferta.id, false);
      toast.info('Hora rechazada. Seguirás en lista de espera.');
      onRespuesta();
    } catch {
      toast.error('Error al rechazar la hora');
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-amber-800 mb-1">
          Nueva hora disponible
        </p>
        <p className="text-sm text-amber-700">
          Se liberó una hora de <strong>{oferta.especialidad}</strong> el{' '}
          <strong>{oferta.fechaHora}</strong> con {oferta.medico}.
          ¿Deseas tomarla?
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleAceptar}
          className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 border border-green-400 rounded-lg hover:bg-green-200 transition-colors"
        >
          Aceptar
        </button>
        <button
          onClick={handleRechazar}
          className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 border border-red-400 rounded-lg hover:bg-red-200 transition-colors"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
};