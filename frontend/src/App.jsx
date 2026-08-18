import './index.css';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './ToastContext';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Departments from './pages/Departments';
import Prescriptions from './pages/Prescriptions';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';

const getSystemTheme = () => {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return getSystemTheme();
};

const hasAuthCallback = () =>
  typeof window !== 'undefined' && /[?&](token|error)=/.test(window.location.search);

function Inner({ theme, setTheme }) {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [authView, setAuthView] = useState(() => (hasAuthCallback() ? 'auth' : 'landing'));

  if (!user) {
    return authView === 'landing'
      ? <Landing onGetStarted={() => setAuthView('auth')} onLogin={() => setAuthView('auth')} />
      : <Auth onBack={() => setAuthView('landing')} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':      return <Dashboard />;
      case 'patients':       return <Patients />;
      case 'departments':    return <Departments />;
      case 'doctors':        return <Doctors />;
      case 'appointments':   return <Appointments />;
      case 'prescriptions':   return <Prescriptions />;
      case 'medicalRecords':  return <MedicalRecords />;
      case 'myAppointments': return <Appointments myOnly />;
      case 'profile':        return <Profile />;
      case 'settings':       return <Settings theme={theme} setTheme={setTheme} />;
      default:               return <Dashboard />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar page={page} setPage={setPage} theme={theme} />
      <main className={styles.main}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;
    const syncTheme = event => {
      if (!localStorage.getItem('theme')) setTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener?.('change', syncTheme);
    return () => media.removeEventListener?.('change', syncTheme);
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <Inner theme={theme} setTheme={setTheme} />
      </ToastProvider>
    </AuthProvider>
  );
}
