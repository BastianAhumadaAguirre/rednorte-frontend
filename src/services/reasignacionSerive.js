import api from './api';

export const reasignacionService = {
  getPendientes: async () => {
    const response = await api.get('/reasignacion/pendientes');
    return response.data;
  },
  responder: async (id, acepta) => {
    const response = await api.put(`/reasignacion/${id}/responder`, { acepta });
    return response.data;
  },
};