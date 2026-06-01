import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PosicionEspera } from '../components/pacientes/PosicionEspera';

describe('PosicionEspera', () => {
  it('muestra la especialidad recibida por props', () => {
    render(
      <PosicionEspera
        posicion={3}
        total={10}
        especialidad="Cardiología"
      />
    );

    expect(
      screen.getByText(/Posición en lista — Cardiología/i)
    ).toBeInTheDocument();
  });

  it('muestra correctamente la posición y el total de pacientes', () => {
    render(
      <PosicionEspera
        posicion={3}
        total={10}
        especialidad="Cardiología"
      />
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(
      screen.getByText('de 10 pacientes en espera')
    ).toBeInTheDocument();
  });

  it('muestra el mensaje de espera estimada', () => {
    render(
      <PosicionEspera
        posicion={3}
        total={10}
        especialidad="Cardiología"
      />
    );

    expect(
      screen.getByText(/Espera estimada:/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/2–3 semanas/i)
    ).toBeInTheDocument();
  });

  it('calcula correctamente el porcentaje de avance', () => {
    const { container } = render(
      <PosicionEspera
        posicion={3}
        total={10}
        especialidad="Cardiología"
      />
    );

    const progressBar = container.querySelector('.bg-blue-500');

    expect(progressBar).toHaveStyle({
      width: '70%',
    });
  });

  it('utiliza porcentaje 0 cuando total es 0', () => {
    const { container } = render(
      <PosicionEspera
        posicion={1}
        total={0}
        especialidad="Cardiología"
      />
    );

    const progressBar = container.querySelector('.bg-blue-500');

    expect(progressBar).toHaveStyle({
      width: '0%',
    });
  });
});