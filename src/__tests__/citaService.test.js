import { describe, it, expect, vi, beforeEach } from 'vitest';
import { citaService } from '../services/citaService';
import listaEsperaApi from '../services/listaEsperaApi';

vi.mock('../services/listaEsperaApi', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('citaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll obtiene citas programadas', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: ['cita1'] });

    const result = await citaService.getAll();

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/estado/PROGRAMADA');
    expect(result).toEqual(['cita1']);
  });

  it('getById obtiene una cita por id', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: { id: 1 } });

    const result = await citaService.getById(1);

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/1');
    expect(result).toEqual({ id: 1 });
  });

  it('getBySolicitud obtiene citas por solicitud', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await citaService.getBySolicitud(5);

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/solicitud/5');
  });

  it('getByEstado obtiene citas por estado', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await citaService.getByEstado('CONFIRMADA');

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/estado/CONFIRMADA');
  });

  it('getByPaciente obtiene citas por paciente', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await citaService.getByPaciente(10);

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/paciente/10');
  });

  it('getByMedico obtiene citas por médico', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await citaService.getByMedico(20);

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/medico/20');
  });

  it('getReasignacion obtiene citas para reasignación', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await citaService.getReasignacion();

    expect(listaEsperaApi.get).toHaveBeenCalledWith('/v1/citas/reasignacion');
  });

  it('create crea una cita', async () => {
    const cita = { pacienteId: 1 };

    listaEsperaApi.post.mockResolvedValueOnce({ data: cita });

    const result = await citaService.create(cita);

    expect(listaEsperaApi.post).toHaveBeenCalledWith('/v1/citas', cita);
    expect(result).toEqual(cita);
  });

  it('confirmar confirma una cita', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await citaService.confirmar(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith('/v1/citas/15/confirmar');
  });

  it('realizar marca una cita como realizada', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await citaService.realizar(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith('/v1/citas/15/realizar');
  });

  it('cancelar cancela una cita usando el motivo indicado', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await citaService.cancelar(15, 'Paciente enfermo');

    expect(listaEsperaApi.put).toHaveBeenCalledWith(
      '/v1/citas/15/cancelar',
      null,
      {
        params: {
          motivo: 'Paciente enfermo',
        },
      }
    );
  });

  it('cancelar utiliza el motivo por defecto cuando no se indica uno', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await citaService.cancelar(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith(
      '/v1/citas/15/cancelar',
      null,
      {
        params: {
          motivo: 'Sin motivo especificado',
        },
      }
    );
  });

  it('marcarNoAsistio actualiza el estado de la cita', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await citaService.marcarNoAsistio(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith(
      '/v1/citas/15/no-asistio'
    );
  });

  it('delete elimina una cita', async () => {
    listaEsperaApi.delete.mockResolvedValueOnce({ data: {} });

    await citaService.delete(15);

    expect(listaEsperaApi.delete).toHaveBeenCalledWith('/v1/citas/15');
  });
});