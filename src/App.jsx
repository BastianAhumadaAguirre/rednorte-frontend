import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PrivateRoute } from './components/common/PrivateRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layouts (pequeños, no necesitan lazy)
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';

// Páginas públicas
const HomePage = lazy(() => import('./pages/public/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage').then(m => ({ default: m.RegisterPage })));

// Paciente
const PacienteDashboard = lazy(() => import('./pages/paciente/PacienteDashboard').then(m => ({ default: m.PacienteDashboard })));
const MisSolicitudes = lazy(() => import('./pages/paciente/MisSolicitudes').then(m => ({ default: m.MisSolicitudes })));
const MisCitas = lazy(() => import('./pages/paciente/MisCitas').then(m => ({ default: m.MisCitas })));
const MiPerfil = lazy(() => import('./pages/paciente/MiPerfil').then(m => ({ default: m.MiPerfil })));
const NuevaSolicitud = lazy(() => import('./pages/paciente/NuevaSolicitud').then(m => ({ default: m.NuevaSolicitud })));
const DetalleCita = lazy(() => import('./pages/paciente/DetalleCita').then(m => ({ default: m.DetalleCita })));

// Funcionario
const FuncionarioDashboard = lazy(() => import('./pages/funcionario/FuncionarioDashboard').then(m => ({ default: m.FuncionarioDashboard })));
const AgendarHora = lazy(() => import('./pages/funcionario/AgendarHora').then(m => ({ default: m.AgendarHora })));
const FichaReadOnly = lazy(() => import('./pages/funcionario/FichaReadOnly').then(m => ({ default: m.FichaReadOnly })));

// Médico
const MedicoDashboard = lazy(() => import('./pages/medico/MedicoDashboard').then(m => ({ default: m.MedicoDashboard })));
const HistoriaClinica = lazy(() => import('./pages/medico/HistoriaClinica').then(m => ({ default: m.HistoriaClinica })));
const Examenes = lazy(() => import('./pages/medico/Examenes').then(m => ({ default: m.Examenes })));

// Admin Hospital
const AdminHospitalDashboard = lazy(() => import('./pages/admin/AdminHospitalDashboard').then(m => ({ default: m.AdminHospitalDashboard })));
const GestionCuentas = lazy(() => import('./pages/admin/GestionCuentas').then(m => ({ default: m.GestionCuentas })));
const ListaEsperaGlobal = lazy(() => import('./pages/admin/ListaEsperaGlobal').then(m => ({ default: m.ListaEsperaGlobal })));

// Admin Software
const AdminSoftDashboard = lazy(() => import('./pages/admin/AdminSoftDashboard').then(m => ({ default: m.AdminSoftDashboard })));
const GestionPermisos = lazy(() => import('./pages/admin/GestionPermisos').then(m => ({ default: m.GestionPermisos })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
    <LanguageProvider>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Público */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              {/* Auth */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Paciente */}
              <Route
                element={
                  <PrivateRoute allowedRoles={['PACIENTE']}>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/paciente/dashboard" element={<PacienteDashboard />} />
                <Route path="/paciente/solicitudes" element={<MisSolicitudes />} />
                <Route path="/paciente/citas" element={<MisCitas />} />
                <Route path="/paciente/perfil" element={<MiPerfil />} />
                <Route path="/paciente/nueva-solicitud" element={<NuevaSolicitud />} />
                <Route path="/paciente/citas/:id" element={<DetalleCita />} />
              </Route>

              {/* Funcionario */}
              <Route
                element={
                  <PrivateRoute allowedRoles={['FUNCIONARIO']}>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/funcionario/dashboard" element={<FuncionarioDashboard />} />
                <Route path="/funcionario/agendar" element={<AgendarHora />} />
                <Route path="/funcionario/lista-espera" element={<ListaEsperaGlobal />} />
                <Route path="/funcionario/pacientes" element={<FichaReadOnly />} />
              </Route>

              {/* Médico */}
              <Route
                element={
                  <PrivateRoute allowedRoles={['MEDICO']}>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/medico/dashboard" element={<MedicoDashboard />} />
                <Route path="/medico/pacientes" element={<FichaReadOnly />} />
                <Route path="/medico/historia" element={<HistoriaClinica />} />
                <Route path="/medico/examenes" element={<Examenes />} />
              </Route>

              {/* Admin Hospital */}
              <Route
                element={
                  <PrivateRoute allowedRoles={['ADMIN_HOSPITAL']}>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/admin/hospital/dashboard" element={<AdminHospitalDashboard />} />
                <Route path="/admin/hospital/lista-espera" element={<ListaEsperaGlobal />} />
                <Route path="/admin/hospital/cuentas" element={<GestionCuentas />} />
              </Route>

              {/* Admin Software */}
              <Route
                element={
                  <PrivateRoute allowedRoles={['ADMIN_SOFTWARE']}>
                    <MainLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/admin/software/dashboard" element={<AdminSoftDashboard />} />
                <Route path="/admin/software/permisos" element={<GestionPermisos />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
