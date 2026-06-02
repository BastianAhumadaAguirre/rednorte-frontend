import { describe, it, expect, beforeEach, vi } from 'vitest';
import pacienteApi from '../services/pacienteApi';
import medicoApi from '../services/medicoApi';

const getRequestInterceptor = (apiClient) =>
  apiClient.interceptors.request.handlers[0].fulfilled;

const getResponseSuccessInterceptor = (apiClient) =>
  apiClient.interceptors.response.handlers[0].fulfilled;

const getResponseErrorInterceptor = (apiClient) =>
  apiClient.interceptors.response.handlers[0].rejected;

const resetLocation = () => {
  Object.defineProperty(window, 'location', {
    value: { href: '' },
    writable: true,
  });
};

const testApiClient = (nombreCliente, apiClient, tokenDemo, errorNoAutorizado = 500) => {
  describe(nombreCliente, () => {
    it('agrega el token JWT al header Authorization cuando existe en localStorage', () => {
      localStorage.setItem('token', tokenDemo);

      const interceptor = getRequestInterceptor(apiClient);
      const config = interceptor({ headers: {} });

      expect(config.headers.Authorization).toBe(`Bearer ${tokenDemo}`);
    });

    it('no agrega Authorization cuando no existe token en localStorage', () => {
      const interceptor = getRequestInterceptor(apiClient);
      const config = interceptor({ headers: {} });

      expect(config.headers.Authorization).toBeUndefined();
    });

    it('retorna la respuesta sin modificar cuando la petición es exitosa', () => {
      const interceptor = getResponseSuccessInterceptor(apiClient);
      const response = { data: { ok: true } };

      expect(interceptor(response)).toBe(response);
    });

    it('elimina sesión y redirige a login cuando recibe error 401', async () => {
      localStorage.setItem('token', tokenDemo);
      localStorage.setItem('user', JSON.stringify({ nombre: 'Usuario Demo' }));

      const interceptor = getResponseErrorInterceptor(apiClient);
      const error = { response: { status: 401 } };

      await expect(interceptor(error)).rejects.toEqual(error);

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(window.location.href).toBe('/login');
    });

    it('rechaza errores distintos a 401 sin eliminar sesión', async () => {
      localStorage.setItem('token', tokenDemo);

      const interceptor = getResponseErrorInterceptor(apiClient);
      const error = { response: { status: errorNoAutorizado } };

      await expect(interceptor(error)).rejects.toEqual(error);

      expect(localStorage.getItem('token')).toBe(tokenDemo);
    });
  });
};

describe('clientes Axios', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    resetLocation();
  });

  testApiClient('pacienteApi', pacienteApi, 'token-paciente', 500);
  testApiClient('medicoApi', medicoApi, 'token-medico', 403);
});