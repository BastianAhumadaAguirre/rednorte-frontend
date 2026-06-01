import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { NuevaSolicitud } from '../pages/paciente/NuevaSolicitud';
import { listaEsperaService } from '../services/listaEsperaService';
import { toast } from 'sonner';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 123,
      nombre: 'Paciente Demo',
    },
  }),
}));

vi.mock('../services/listaEsperaService', () => ({
  listaEsperaService: {
    create: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderComponent = () => {
  render(
    <MemoryRouter>
      <NuevaSolicitud />
    </MemoryRouter>
  );
};

describe('NuevaSolicitud', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el formulario de nueva solicitud', () => {
    renderComponent();

    expect(
      screen.getByText('Nueva solicitud')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Enviar solicitud/i })
    ).toBeInTheDocument();
  });

  it('muestra error si se intenta enviar sin especialidad y hospital', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByRole('button', { name: /Enviar solicitud/i })
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Selecciona especialidad y centro asistencial'
    );

    expect(listaEsperaService.create).not.toHaveBeenCalled();
  });

  it('envía correctamente la solicitud', async () => {
    listaEsperaService.create.mockResolvedValueOnce({});

    const user = userEvent.setup();

    renderComponent();

    const selects = screen.getAllByRole('combobox');

    await user.selectOptions(selects[0], 'Traumatología');
    await user.selectOptions(selects[1], 'Hospital del Norte');

    await user.click(
      screen.getByRole('button', { name: /Enviar solicitud/i })
    );

    await waitFor(() => {
      expect(listaEsperaService.create).toHaveBeenCalledWith({
        pacienteId: 123,
        especialidad: 'Traumatología',
        hospital: 'Hospital del Norte',
        prioridad: 2,
        observaciones: undefined,
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Solicitud enviada correctamente'
      );

      expect(navigateMock).toHaveBeenCalledWith(
        '/paciente/solicitudes'
      );
    });
  });

  it('envía observaciones cuando existen', async () => {
    listaEsperaService.create.mockResolvedValueOnce({});

    const user = userEvent.setup();

    renderComponent();

    const selects = screen.getAllByRole('combobox');

    await user.selectOptions(selects[0], 'Cardiología');
    await user.selectOptions(selects[1], 'Hospital San José');

    await user.type(
      screen.getByPlaceholderText(
        /Describe brevemente tu situación/i
      ),
      'Dolor persistente'
    );

    await user.click(
      screen.getByRole('button', { name: /Enviar solicitud/i })
    );

    await waitFor(() => {
      expect(listaEsperaService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          observaciones: 'Dolor persistente',
        })
      );
    });
  });

  it('muestra error cuando el backend responde con mensaje personalizado', async () => {
    listaEsperaService.create.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Paciente ya posee una solicitud activa',
        },
      },
    });

    const user = userEvent.setup();

    renderComponent();

    const selects = screen.getAllByRole('combobox');

    await user.selectOptions(selects[0], 'Traumatología');
    await user.selectOptions(selects[1], 'Hospital del Norte');

    await user.click(
      screen.getByRole('button', { name: /Enviar solicitud/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Paciente ya posee una solicitud activa'
      );
    });
  });

  it('permite cancelar y volver al listado', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByRole('button', { name: /Cancelar/i })
    );

    expect(navigateMock).toHaveBeenCalledWith(
      '/paciente/solicitudes'
    );
  });
});