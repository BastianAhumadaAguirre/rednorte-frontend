// src/services/authService.js
import api from './api';

export const authService = {

  // Iniciar sesión
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual desde localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar si hay token activo
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Registrar nuevo usuario
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },


  // Login BENJA para pruebas (NO TOCAR)
  devLogin: () => {
    const fakeUser = {
      id: 1,
      name: "Dev User",
      email: "dev@test.com",
      role: "admin"
    };

    const fakeToken = "dev-token";

    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(fakeUser));

    return { token: fakeToken, user: fakeUser };
  },

};