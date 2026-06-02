import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listaEsperaService } from '../services/listaEsperaService';
import listaEsperaApi from '../services/listaEsperaApi';

vi.mock('../services/listaEsperaApi', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('listaEsperaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll obtiene solicitudes pendientes', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: ['solicitud1'] });

    const result = await listaEsperaService.getAll();

    expect(listaEsperaApi.get).toHaveBeenCalledWith(
      '/v1/lista-espera/pendientes'
    );
    expect(result).toEqual(['solicitud1']);
  });

  it('getById obtiene una solicitud por id', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: { id: 1 } });

    const result = await listaEsperaService.getById(1);

    expect(listaEsperaApi.get).toHaveBeenCalledWith(
      '/v1/lista-espera/1'
    );
    expect(result).toEqual({ id: 1 });
  });

  it('getByEstado obtiene solicitudes por estado', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await listaEsperaService.getByEstado('PENDIENTE');

    expect(listaEsperaApi.get).toHaveBeenCalledWith(
      '/v1/lista-espera/estado/PENDIENTE'
    );
  });

  it('getByPaciente obtiene solicitudes por paciente', async () => {
    listaEsperaApi.get.mockResolvedValueOnce({ data: [] });

    await listaEsperaService.getByPaciente(10);

    expect(listaEsperaApi.get).toHaveBeenCalledWith(
      '/v1/lista-espera/paciente/10'
    );
  });

  it('create crea una nueva solicitud', async () => {
    const solicitud = {
      pacienteId: 1,
      especialidad: 'Cardiología',
    };

    listaEsperaApi.post.mockResolvedValueOnce({
      data: solicitud,
    });

    const result = await listaEsperaService.create(solicitud);

    expect(listaEsperaApi.post).toHaveBeenCalledWith(
      '/v1/lista-espera',
      solicitud
    );

    expect(result).toEqual(solicitud);
  });

  it('asignar cambia el estado de una solicitud a asignada', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await listaEsperaService.asignar(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith(
      '/v1/lista-espera/15/asignar'
    );
  });

  it('atender cambia el estado de una solicitud a atendida', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await listaEsperaService.atender(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith(
      '/v1/lista-espera/15/atender'
    );
  });

  it('cancelar cambia el estado de una solicitud a cancelada', async () => {
    listaEsperaApi.put.mockResolvedValueOnce({ data: {} });

    await listaEsperaService.cancelar(15);

    expect(listaEsperaApi.put).toHaveBeenCalledWith(
      '/v1/lista-espera/15/cancelar'
    );
  });

  it('delete elimina una solicitud', async () => {
    listaEsperaApi.delete.mockResolvedValueOnce({ data: {} });

    await listaEsperaService.delete(15);

    expect(listaEsperaApi.delete).toHaveBeenCalledWith(
      '/v1/lista-espera/15'
    );
  });
});