import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PrivateRoute } from '../components/common/PrivateRoute';

const renderPrivateRoute = ({ user = null, isAuthenticated = false, allowedRoles = ['PACIENTE'] } = {}) => {
  return render(
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/login" element={<p>Página Login</p>} />
          <Route
            path="/privado"
            element={
              <PrivateRoute allowedRoles={allowedRoles}>
                <p>Contenido Privado</p>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('PrivateRoute', () => {
  it('redirige al login cuando el usuario no está autenticado', () => {
    renderPrivateRoute();

    expect(screen.getByText('Página Login')).toBeInTheDocument();
  });

  it('redirige al login cuando el usuario tiene un rol no permitido', () => {
    renderPrivateRoute({
      user: { rol: 'MEDICO' },
      isAuthenticated: true,
      allowedRoles: ['PACIENTE'],
    });

    expect(screen.getByText('Página Login')).toBeInTheDocument();
  });

  it('muestra el contenido protegido cuando el usuario tiene un rol permitido', () => {
    renderPrivateRoute({
      user: { rol: 'PACIENTE' },
      isAuthenticated: true,
      allowedRoles: ['PACIENTE'],
    });

    expect(screen.getByText('Contenido Privado')).toBeInTheDocument();
  });

  it('permite el acceso si no se especifican roles permitidos y el usuario está autenticado', () => {
    renderPrivateRoute({
      user: { rol: 'PACIENTE' },
      isAuthenticated: true,
      allowedRoles: undefined,
    });

    expect(screen.getByText('Contenido Privado')).toBeInTheDocument();
  });
});