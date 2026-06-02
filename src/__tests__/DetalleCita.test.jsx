import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DetalleCita } from '../pages/paciente/DetalleCita';
import { citaService } from '../services/citaService';
import { toast } from 'sonner';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../services/citaService', () => ({
  citaService: {
    getById: vi.fn(),
    confirmar: vi.fn(),
    cancelar: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const citaProgramadaMock = {
  id: 15,
  estado: 'PROGRAMADA',
  especialidad: 'Traumatología',
  nombreMedico: 'Dr. Pérez',
  hospital: 'Hospital Norte',
  boxNumero: 'Box 3',
  fechaHoraCita: '2026-06-10T09:30:00',
};

const renderDetalleCita = () => {
  render(
    <MemoryRouter initialEntries={['/paciente/citas/15']}>
      <Routes>
        <Route path="/paciente/citas/:id" element={<DetalleCita />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('DetalleCita', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga y muestra los datos principales de la cita', async () => {
    citaService.getById.mockResolvedValueOnce(citaProgramadaMock);

    renderDetalleCita();

    expect(await screen.findByText('Detalle de cita')).toBeInTheDocument();
    expect(screen.getByText('Traumatología')).toBeInTheDocument();
    expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    expect(screen.getByText('Hospital Norte')).toBeInTheDocument();
    expect(screen.getByText('Box 3')).toBeInTheDocument();
    expect(screen.getByText('PROGRAMADA')).toBeInTheDocument();
  });

  it('muestra el botón Confirmar asistencia cuando la cita está PROGRAMADA', async () => {
    citaService.getById.mockResolvedValueOnce(citaProgramadaMock);

    renderDetalleCita();

    expect(
      await screen.findByRole('button', { name: /Confirmar asistencia/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Cancelar cita/i })
    ).toBeInTheDocument();
  });

  it('oculta Confirmar asistencia cuando la cita está CONFIRMADA y mantiene Cancelar cita', async () => {
    citaService.getById.mockResolvedValueOnce({
      ...citaProgramadaMock,
      estado: 'CONFIRMADA',
    });

    renderDetalleCita();

    await screen.findByText('CONFIRMADA');

    expect(
      screen.queryByRole('button', { name: /Confirmar asistencia/i })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Cancelar cita/i })
    ).toBeInTheDocument();
  });

  it('oculta las acciones cuando la cita está REALIZADA', async () => {
    citaService.getById.mockResolvedValueOnce({
      ...citaProgramadaMock,
      estado: 'REALIZADA',
    });

    renderDetalleCita();

    await screen.findByText('REALIZADA');

    expect(
      screen.queryByRole('button', { name: /Confirmar asistencia/i })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /Cancelar cita/i })
    ).not.toBeInTheDocument();
  });

  it('confirma la cita y recarga los datos', async () => {
    citaService.getById
      .mockResolvedValueOnce(citaProgramadaMock)
      .mockResolvedValueOnce({
        ...citaProgramadaMock,
        estado: 'CONFIRMADA',
      });

    citaService.confirmar.mockResolvedValueOnce({});
    const user = userEvent.setup();

    renderDetalleCita();

    await user.click(
      await screen.findByRole('button', { name: /Confirmar asistencia/i })
    );

    await waitFor(() => {
      expect(citaService.confirmar).toHaveBeenCalledWith('15');
      expect(toast.success).toHaveBeenCalledWith('Cita confirmada');
      expect(citaService.getById).toHaveBeenCalledTimes(2);
    });
  });

  it('cancela la cita y redirige al listado de citas', async () => {
    citaService.getById.mockResolvedValueOnce(citaProgramadaMock);
    citaService.cancelar.mockResolvedValueOnce({});
    const user = userEvent.setup();

    renderDetalleCita();

    await user.click(
      await screen.findByRole('button', { name: /Cancelar cita/i })
    );

    await waitFor(() => {
      expect(citaService.cancelar).toHaveBeenCalledWith(
        '15',
        'Cancelado por el paciente'
      );
      expect(toast.success).toHaveBeenCalledWith('Cita cancelada correctamente');
      expect(navigateMock).toHaveBeenCalledWith('/paciente/citas');
    });
  });

  it('muestra mensaje de cita no encontrada cuando el servicio retorna null', async () => {
    citaService.getById.mockResolvedValueOnce(null);

    renderDetalleCita();

    expect(await screen.findByText('Cita no encontrada')).toBeInTheDocument();
  });

  it('muestra error si falla la carga de la cita', async () => {
    citaService.getById.mockRejectedValueOnce(new Error('Error'));

    renderDetalleCita();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cargar la cita');
    });

    expect(screen.getByText('Cita no encontrada')).toBeInTheDocument();
  });

  it('muestra error si falla la confirmación de la cita', async () => {
    citaService.getById.mockResolvedValueOnce(citaProgramadaMock);
    citaService.confirmar.mockRejectedValueOnce(new Error('Error'));
    const user = userEvent.setup();

    renderDetalleCita();

    await user.click(
      await screen.findByRole('button', { name: /Confirmar asistencia/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al confirmar la cita');
    });
  });

  it('muestra error si falla la cancelación de la cita', async () => {
    citaService.getById.mockResolvedValueOnce(citaProgramadaMock);
    citaService.cancelar.mockRejectedValueOnce(new Error('Error'));
    const user = userEvent.setup();

    renderDetalleCita();

    await user.click(
      await screen.findByRole('button', { name: /Cancelar cita/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cancelar la cita');
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});