import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertaReasignacion } from '../components/pacientes/AlertaReasignacion';
import { reasignacionService } from '../services/reasignacionService';
import { toast } from 'sonner';

vi.mock('../services/reasignacionService', () => ({
  reasignacionService: {
    responder: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const ofertaMock = {
  id: 10,
  especialidad: 'Traumatología',
  fechaHora: '2026-06-10 09:30',
  medico: 'Dr. Pérez',
};

describe('AlertaReasignacion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra los datos de la oferta de reasignación', () => {
    render(
      <AlertaReasignacion
        oferta={ofertaMock}
        onRespuesta={vi.fn()}
      />
    );

    expect(screen.getByText('Nueva hora disponible')).toBeInTheDocument();
    expect(screen.getByText('Traumatología')).toBeInTheDocument();
    expect(screen.getByText('2026-06-10 09:30')).toBeInTheDocument();
    expect(screen.getByText(/Dr. Pérez/i)).toBeInTheDocument();
  });

  it('muestra los botones para aceptar y rechazar la hora', () => {
    render(
      <AlertaReasignacion
        oferta={ofertaMock}
        onRespuesta={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Aceptar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Rechazar/i })).toBeInTheDocument();
  });

  it('acepta la hora disponible y ejecuta onRespuesta', async () => {
    reasignacionService.responder.mockResolvedValueOnce({});
    const onRespuesta = vi.fn();
    const user = userEvent.setup();

    render(
      <AlertaReasignacion
        oferta={ofertaMock}
        onRespuesta={onRespuesta}
      />
    );

    await user.click(screen.getByRole('button', { name: /Aceptar/i }));

    await waitFor(() => {
      expect(reasignacionService.responder).toHaveBeenCalledWith(10, true);
      expect(toast.success).toHaveBeenCalledWith('Hora aceptada correctamente');
      expect(onRespuesta).toHaveBeenCalled();
    });
  });

  it('rechaza la hora disponible y ejecuta onRespuesta', async () => {
    reasignacionService.responder.mockResolvedValueOnce({});
    const onRespuesta = vi.fn();
    const user = userEvent.setup();

    render(
      <AlertaReasignacion
        oferta={ofertaMock}
        onRespuesta={onRespuesta}
      />
    );

    await user.click(screen.getByRole('button', { name: /Rechazar/i }));

    await waitFor(() => {
      expect(reasignacionService.responder).toHaveBeenCalledWith(10, false);
      expect(toast.info).toHaveBeenCalledWith(
        'Hora rechazada. Seguirás en lista de espera.'
      );
      expect(onRespuesta).toHaveBeenCalled();
    });
  });

  it('muestra error si falla la aceptación de la hora', async () => {
    reasignacionService.responder.mockRejectedValueOnce(new Error('Error'));
    const onRespuesta = vi.fn();
    const user = userEvent.setup();

    render(
      <AlertaReasignacion
        oferta={ofertaMock}
        onRespuesta={onRespuesta}
      />
    );

    await user.click(screen.getByRole('button', { name: /Aceptar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al aceptar la hora');
      expect(onRespuesta).not.toHaveBeenCalled();
    });
  });

  it('muestra error si falla el rechazo de la hora', async () => {
    reasignacionService.responder.mockRejectedValueOnce(new Error('Error'));
    const onRespuesta = vi.fn();
    const user = userEvent.setup();

    render(
      <AlertaReasignacion
        oferta={ofertaMock}
        onRespuesta={onRespuesta}
      />
    );

    await user.click(screen.getByRole('button', { name: /Rechazar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al rechazar la hora');
      expect(onRespuesta).not.toHaveBeenCalled();
    });
  });
});