import { test, expect } from '@playwright/test';

const PACIENTE_EMAIL = 'bulk.p0499@rednorte.cl';
const PACIENTE_PASSWORD = 'rednorte2025';

async function loginPaciente(page) {
  await page.goto('/login');

  await expect(page.getByText('Red Norte')).toBeVisible();

  await page.getByRole('button', { name: /soy paciente/i }).click();

  await page.locator('input[type="email"]').fill(PACIENTE_EMAIL);
  await page.locator('input[type="password"]').fill(PACIENTE_PASSWORD);

  await Promise.all([
    page.waitForURL(/\/paciente\/dashboard/, { timeout: 15000 }),
    page.getByRole('button', { name: /ingresar/i }).click(),
  ]);

  await expect(page.getByText('Bienvenido')).toBeVisible({ timeout: 10000 });
}

test.describe('Flujos E2E RedNorte - Paciente', () => {
  test('paciente inicia sesión correctamente', async ({ page }) => {
    await loginPaciente(page);

    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mis Solicitudes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mis Citas' })).toBeVisible();
  });

  test('paciente navega al módulo de solicitudes', async ({ page }) => {
    await loginPaciente(page);

    await page.getByRole('button', { name: 'Mis Solicitudes' }).click();

    await expect(
      page.getByText(/solicitudes|lista de espera|posición|pendiente/i).first()
    ).toBeVisible();
  });

  test('paciente visualiza y completa el formulario de nueva solicitud', async ({ page }) => {
  await loginPaciente(page);

  await page.goto('/paciente/nueva-solicitud');

  await expect(page.getByRole('heading', { name: /nueva solicitud/i })).toBeVisible();

  await page.selectOption('select[name="especialidad"]', 'Traumatología');
  await page.selectOption('select[name="hospital"]', 'Hospital del Norte');

  await page.locator('textarea[name="observaciones"]').fill(
    'Prueba E2E con Playwright'
  );

  await expect(page.locator('select[name="especialidad"]')).toHaveValue('Traumatología');
  await expect(page.locator('select[name="hospital"]')).toHaveValue('Hospital del Norte');
  await expect(page.locator('textarea[name="observaciones"]')).toHaveValue(
    'Prueba E2E con Playwright'
  );
});

});