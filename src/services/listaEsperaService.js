// src/services/listaEsperaService.js
import api from './api';

export const listaEsperaService = {

  // Obtener todas las solicitudes
  getAll: async () => {
    const response = await api.get('/lista-espera');
    return response.data;
  },

  // Obtener una solicitud por ID
  getById: async (id) => {
    const response = await api.get(`/lista-espera/${id}`);
    return response.data;
  },

  // Crear nueva solicitud
  create: async (solicitudData) => {
    const response = await api.post('/lista-espera', solicitudData);
    return response.data;
  },

  // Actualizar estado de una solicitud
  updateEstado: async (id, estado) => {
    const response = await api.put(`/lista-espera/${id}/estado`, { estado });
    return response.data;
  },

  // Obtener solicitudes por paciente
  getByPaciente: async (pacienteId) => {
    const response = await api.get(`/lista-espera/paciente/${pacienteId}`);
    return response.data;
  },

  // Eliminar solicitud
  delete: async (id) => {
    const response = await api.delete(`/lista-espera/${id}`);
    return response.data;
  },

};