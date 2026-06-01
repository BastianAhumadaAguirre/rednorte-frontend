import { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    nav: {
      dashboard: 'Dashboard',
      solicitudes: 'Mis Solicitudes',
      citas: 'Mis Citas',
      perfil: 'Mi Perfil',
      nuevaSolicitud: 'Nueva Solicitud',
      agendarHora: 'Agendar Hora',
      listaEspera: 'Lista de Espera',
      pacientes: 'Pacientes',
      historiaClinica: 'Historia Clínica',
      examenes: 'Exámenes',
      cuentas: 'Cuentas',
      permisos: 'Permisos',
      inicio: 'Inicio',
      quienesSomos: 'Quiénes Somos',
      contacto: 'Contacto',
    },
    auth: {
      login: 'Iniciar sesión',
      register: 'Registrarme',
      logout: 'Cerrar sesión',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      solicitudes: 'My Requests',
      citas: 'My Appointments',
      perfil: 'My Profile',
      nuevaSolicitud: 'New Request',
      agendarHora: 'Schedule',
      listaEspera: 'Waiting List',
      pacientes: 'Patients',
      historiaClinica: 'Clinical History',
      examenes: 'Exams',
      cuentas: 'Accounts',
      permisos: 'Permissions',
      inicio: 'Home',
      quienesSomos: 'About Us',
      contacto: 'Contact',
    },
    auth: {
      login: 'Sign In',
      register: 'Register',
      logout: 'Sign Out',
    },
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'es');

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  const t = (key) => {
    const parts = key.split('.');
    let val = translations[lang];
    for (const k of parts) val = val?.[k];
    return val ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
