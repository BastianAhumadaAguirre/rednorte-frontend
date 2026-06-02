import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import pacienteApi from '../services/pacienteApi';
import medicoApi from '../services/medicoApi';

vi.mock('../services/pacienteApi', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../services/medicoApi', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loginPaciente autentica al paciente, guarda token y retorna datos del usuario', async () => {
    pacienteApi.post.mockResolvedValue({
      data: {
        token: 'token-paciente',
        rol: 'PACIENTE',
        nombre: 'Paciente Demo',
        redirectUrl: '/paciente/dashboard',
        id: 1,
      },
    });

    const result = await authService.loginPaciente('paciente@test.cl', '1234');

    expect(pacienteApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'paciente@test.cl',
      password: '1234',
    });

    expect(localStorage.getItem('token')).toBe('token-paciente');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      token: 'token-paciente',
      rol: 'PACIENTE',
      nombre: 'Paciente Demo',
      email: 'paciente@test.cl',
      id: 1,
    });

    expect(result).toEqual({
      token: 'token-paciente',
      rol: 'PACIENTE',
      nombre: 'Paciente Demo',
      email: 'paciente@test.cl',
      id: 1,
      redirectUrl: '/paciente/dashboard',
    });
  });

  it('loginMedico autentica al médico, guarda token y retorna datos del usuario', async () => {
    medicoApi.post.mockResolvedValue({
      data: {
        token: 'token-medico',
        rol: 'MEDICO',
        nombre: 'Medico Demo',
        redirectUrl: '/medico/dashboard',
        id: 2,
      },
    });

    const result = await authService.loginMedico('medico@test.cl', '1234');

    expect(medicoApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'medico@test.cl',
      password: '1234',
    });

    expect(localStorage.getItem('token')).toBe('token-medico');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      token: 'token-medico',
      rol: 'MEDICO',
      nombre: 'Medico Demo',
      email: 'medico@test.cl',
      id: 2,
    });

    expect(result).toEqual({
      token: 'token-medico',
      rol: 'MEDICO',
      nombre: 'Medico Demo',
      email: 'medico@test.cl',
      id: 2,
      redirectUrl: '/medico/dashboard',
    });
  });

  it('registerPaciente envía los datos de registro y retorna la respuesta del backend', async () => {
    pacienteApi.post.mockResolvedValue({
      data: {
        id: 3,
        email: 'nuevo@test.cl',
        nombreCompleto: 'Nuevo Paciente',
      },
    });

    const result = await authService.registerPaciente(
      'nuevo@test.cl',
      '1234',
      'Nuevo Paciente',
      '11.111.111-1',
      '2000-01-01'
    );

    expect(pacienteApi.post).toHaveBeenCalledWith('/auth/register', {
      email: 'nuevo@test.cl',
      password: '1234',
      nombreCompleto: 'Nuevo Paciente',
      rut: '11.111.111-1',
      fechaNacimiento: '2000-01-01',
    });

    expect(result).toEqual({
      id: 3,
      email: 'nuevo@test.cl',
      nombreCompleto: 'Nuevo Paciente',
    });
  });

  it('logout elimina token y usuario desde localStorage', () => {
    localStorage.setItem('token', 'token-demo');
    localStorage.setItem('user', JSON.stringify({ nombre: 'Usuario Demo' }));

    authService.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('getCurrentUser retorna el usuario guardado en localStorage', () => {
    const user = {
      id: 1,
      token: 'token-paciente',
      rol: 'PACIENTE',
      nombre: 'Paciente Demo',
      email: 'paciente@test.cl',
    };

    localStorage.setItem('user', JSON.stringify(user));

    expect(authService.getCurrentUser()).toEqual(user);
  });

  it('getCurrentUser retorna null si no hay usuario guardado', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('getCurrentUser retorna null si el usuario guardado tiene JSON inválido', () => {
    localStorage.setItem('user', '{json-invalido');

    expect(authService.getCurrentUser()).toBeNull();
  });
});