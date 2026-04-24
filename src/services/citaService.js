// src/services/citaService.js
import api from './api';

export const citaService = {

  // Obtener todas las citas
  getAll: async () => {
    const response = await api.get('/citas');
    return response.data;
  },

  // Obtener una cita por ID
  getById: async (id) => {
    const response = await api.get(`/citas/${id}`);
    return response.data;
  },

  // Crear nueva cita
  create: async (citaData) => {
    const response = await api.post('/citas', citaData);
    return response.data;
  },

  // Actualizar una cita
  update: async (id, citaData) => {
    const response = await api.put(`/citas/${id}`, citaData);
    return response.data;
  },

  // Cancelar una cita
  cancel: async (id) => {
    const response = await api.put(`/citas/${id}/cancelar`);
    return response.data;
  },

  // Obtener citas por paciente
  getByPaciente: async (pacienteId) => {
    const response = await api.get(`/citas/paciente/${pacienteId}`);
    return response.data;
  },

  // Eliminar una cita
  delete: async (id) => {
    const response = await api.delete(`/citas/${id}`);
    return response.data;
  },

};