import './index.css';
import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ToastProvider } from './ToastContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Prescriptions from './pages/Prescriptions';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import Sidebar from './components/Sidebar';
import styles from './App.module.css';

function Inner() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <Auth />;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':      return <Dashboard />;
      case 'patients':       return <Patients />;
      case 'doctors':        return <Doctors />;
      case 'appointments':   return <Appointments />;
      case 'prescriptions':   return <Prescriptions />;
      case 'medicalRecords':  return <MedicalRecords />;
      case 'myAppointments': return <Appointments myOnly />;
      default:               return <Dashboard />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar page={page} setPage={setPage} />
      <main className={styles.main}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </AuthProvider>
  );
}
