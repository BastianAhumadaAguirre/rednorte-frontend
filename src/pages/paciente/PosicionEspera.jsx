export const PosicionEspera = ({ posicion, total, especialidad }) => {
  const porcentaje = total > 0 ? Math.round(((total - posicion) / total) * 100) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-xs font-medium text-gray-500 mb-2">
        Posición en lista — {especialidad}
      </p>
      <div className="flex items-center gap-6">
        <div>
          <span className="text-3xl font-bold text-blue-600">{posicion}</span>
          <p className="text-xs text-gray-500 mt-1">de {total} pacientes en espera</p>
          <div className="w-36 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-400 leading-relaxed">
          Espera estimada:<br />
          <span className="text-gray-700 font-medium">2–3 semanas</span><br />
          Te notificaremos por email<br />cuando se libere una hora.
        </div>
      </div>
    </div>
  );
};