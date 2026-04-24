// src/services/pacienteService.js
import api from './api';

export const pacienteService = {

  // Obtener todos los pacientes
  getAll: async () => {
    const response = await api.get('/pacientes');
    return response.data;
  },

  // Obtener un paciente por ID
  getById: async (id) => {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  },

  // Crear un nuevo paciente
  create: async (pacienteData) => {
    const response = await api.post('/pacientes', pacienteData);
    return response.data;
  },

  // Actualizar un paciente existente
  update: async (id, pacienteData) => {
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return response.data;
  },

  // Eliminar un paciente
  delete: async (id) => {
    const response = await api.delete(`/pacientes/${id}`);
    return response.data;
  },

};