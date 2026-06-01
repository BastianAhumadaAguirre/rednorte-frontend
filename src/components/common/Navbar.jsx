import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Moon, Sun, Globe } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LanguageContext';

const LINKS_POR_ROL = {
  PACIENTE: [
    { key: 'nav.dashboard',       ruta: '/paciente/dashboard' },
    { key: 'nav.solicitudes',     ruta: '/paciente/solicitudes' },
    { key: 'nav.citas',           ruta: '/paciente/citas' },
    { key: 'nav.perfil',          ruta: '/paciente/perfil' },
  ],
  FUNCIONARIO: [
    { key: 'nav.dashboard',       ruta: '/funcionario/dashboard' },
    { key: 'nav.agendarHora',     ruta: '/funcionario/agendar' },
    { key: 'nav.listaEspera',     ruta: '/funcionario/lista-espera' },
    { key: 'nav.pacientes',       ruta: '/funcionario/pacientes' },
  ],
  MEDICO: [
    { key: 'nav.dashboard',       ruta: '/medico/dashboard' },
    { key: 'nav.historiaClinica', ruta: '/medico/historia' },
    { key: 'nav.examenes',        ruta: '/medico/examenes' },
    { key: 'nav.pacientes',       ruta: '/medico/pacientes' },
  ],
  ADMIN_HOSPITAL: [
    { key: 'nav.dashboard',       ruta: '/admin/hospital/dashboard' },
    { key: 'nav.listaEspera',     ruta: '/admin/hospital/lista-espera' },
    { key: 'nav.cuentas',         ruta: '/admin/hospital/cuentas' },
  ],
  ADMIN_SOFTWARE: [
    { key: 'nav.dashboard', ruta: '/admin/software/dashboard' },
    { key: 'nav.permisos',  ruta: '/admin/software/permisos' },
  ],
};

const LINKS_PUBLICOS = [
  { key: 'nav.inicio',       ruta: '/' },
  { key: 'nav.quienesSomos', ruta: '/quienes-somos' },
  { key: 'nav.contacto',     ruta: '/contacto' },
];

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggleDark } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = user ? (LINKS_POR_ROL[user.rol] ?? []) : LINKS_PUBLICOS;

  const handleLogout = () => {
    logout();
    setMenuAbierto(false);
    navigate('/');
  };

  const homePath = user ? `/${user.rol.toLowerCase().replace('_', '/')}/dashboard` : '/';
  const isActive = (ruta) => location.pathname === ruta;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => { navigate(homePath); setMenuAbierto(false); }}
              className="text-xl font-bold text-blue-600 flex items-center gap-1"
            >
              RedNorte
            </button>

            {/* Links escritorio */}
            <div className="hidden md:flex gap-1">
              {links.map(l => (
                <button
                  key={l.ruta}
                  onClick={() => navigate(l.ruta)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(l.ruta)
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {t(l.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Acciones escritorio */}
          <div className="hidden md:flex items-center gap-3">
            {/* Toggle idioma */}
            <button
              onClick={toggleLang}
              title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase tracking-wide">{lang === 'es' ? 'EN' : 'ES'}</span>
            </button>

            {/* Toggle tema */}
            <button
              onClick={toggleDark}
              title={dark ? 'Modo claro' : 'Modo oscuro'}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right border-r pr-4 border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-tight">
                    {user.rol?.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/login')
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                  }`}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className={`text-sm px-4 py-2 rounded-lg font-medium border transition-all ${
                    isActive('/register')
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                  }`}
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Controles móvil */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs font-bold"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMenuAbierto(v => !v)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menú"
            >
              {menuAbierto ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {links.map(l => (
              <button
                key={l.ruta}
                onClick={() => { navigate(l.ruta); setMenuAbierto(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(l.ruta)
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t(l.key)}
              </button>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs font-bold text-blue-600 uppercase">{user.rol?.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuAbierto(false)}
                  className="block text-center px-4 py-2.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
