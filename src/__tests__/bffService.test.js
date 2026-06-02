import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bffService } from '../services/bffService';
import listaEsperaApi from '../services/listaEsperaApi';

vi.mock('../services/listaEsperaApi', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('bffService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dashboardPaciente obtiene los datos consolidados del paciente', async () => {
    const dashboard = {
      solicitudes: [],
      citas: [],
      reasignaciones: [],
    };

    listaEsperaApi.get.mockResolvedValueOnce({
      data: dashboard,
    });

    const result = await bffService.dashboardPaciente(10);

    expect(listaEsperaApi.get).toHaveBeenCalledWith(
      '/v1/bff/paciente/10'
    );

    expect(result).toEqual(dashboard);
  });

  it('dashboardMedico obtiene los datos consolidados del médico', async () => {
    const dashboard = {
      pacientes: [],
      citas: [],
    };

    listaEsperaApi.get.mockResolvedValueOnce({
      data: dashboard,
    });

    const result = await bffService.dashboardMedico(20);

    expect(listaEsperaApi.get).toHaveBeenCalledWith(
      '/v1/bff/medico/20'
    );

    expect(result).toEqual(dashboard);
  });
});