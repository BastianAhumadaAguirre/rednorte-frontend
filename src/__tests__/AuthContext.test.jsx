import { useContext } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    loginPaciente: vi.fn(),
    loginMedico: vi.fn(),
    logout: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);

  return (
    <div>
      <p>{isAuthenticated ? 'Autenticado' : 'No autenticado'}</p>
      <p>{user?.nombre || 'Sin usuario'}</p>

      <button onClick={() => login('paciente@test.cl', '1234', 'PACIENTE')}>
        Login Paciente
      </button>

      <button onClick={() => login('medico@test.cl', '1234', 'MEDICO')}>
        Login Médico
      </button>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

const renderAuthProvider = () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('inicia sin usuario cuando no hay datos en localStorage', () => {
    renderAuthProvider();

    expect(screen.getByText('No autenticado')).toBeInTheDocument();
    expect(screen.getByText('Sin usuario')).toBeInTheDocument();
  });

  it('recupera el usuario desde localStorage si existe una sesión guardada', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        token: 'token-paciente',
        rol: 'PACIENTE',
        nombre: 'Paciente Demo',
        email: 'paciente@test.cl',
      })
    );

    renderAuthProvider();

    expect(screen.getByText('Autenticado')).toBeInTheDocument();
    expect(screen.getByText('Paciente Demo')).toBeInTheDocument();
  });

  it('elimina el usuario guardado si localStorage contiene JSON inválido', () => {
    localStorage.setItem('user', '{json-invalido');

    renderAuthProvider();

    expect(screen.getByText('No autenticado')).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('realiza login de paciente y guarda usuario/token en localStorage', async () => {
    authService.loginPaciente.mockResolvedValue({
      id: 1,
      token: 'token-paciente',
      rol: 'PACIENTE',
      nombre: 'Paciente Demo',
      email: 'paciente@test.cl',
    });

    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText('Login Paciente'));

    await waitFor(() => {
      expect(screen.getByText('Autenticado')).toBeInTheDocument();
      expect(screen.getByText('Paciente Demo')).toBeInTheDocument();
    });

    expect(authService.loginPaciente).toHaveBeenCalledWith('paciente@test.cl', '1234');
    expect(localStorage.getItem('token')).toBe('token-paciente');
  });

  it('realiza login de médico usando el servicio correspondiente', async () => {
    authService.loginMedico.mockResolvedValue({
      id: 2,
      token: 'token-medico',
      rol: 'MEDICO',
      nombre: 'Medico Demo',
      email: 'medico@test.cl',
    });

    const user = userEvent.setup();
    renderAuthProvider();

    await user.click(screen.getByText('Login Médico'));

    await waitFor(() => {
      expect(screen.getByText('Autenticado')).toBeInTheDocument();
      expect(screen.getByText('Medico Demo')).toBeInTheDocument();
    });

    expect(authService.loginMedico).toHaveBeenCalledWith('medico@test.cl', '1234');
    expect(localStorage.getItem('token')).toBe('token-medico');
  });

  it('cierra sesión eliminando el usuario del estado', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        token: 'token-paciente',
        rol: 'PACIENTE',
        nombre: 'Paciente Demo',
        email: 'paciente@test.cl',
      })
    );

    const user = userEvent.setup();
    renderAuthProvider();

    expect(screen.getByText('Autenticado')).toBeInTheDocument();

    await user.click(screen.getByText('Cerrar sesión'));

    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByText('No autenticado')).toBeInTheDocument();
  });
});