import { useEffect, useState } from 'react';
import api from '../api';
import { PageHeader } from '../components/UI';
import { useAuth } from '../AuthContext';
import styles from './Dashboard.module.css';

const fmtDate = d => d ? new Date(d).toLocaleString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
const statusLabel = s => ({ pending: 'Хүлээгдэж байна', confirmed: 'Баталгаажсан', completed: 'Дууссан', cancelled: 'Цуцлагдсан' })[s] || s;

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: '—', doctors: '—', appointments: '—', pending: '—' });
  const [recentAppts, setRecentAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, d, a] = await Promise.all([
          api.get('/patients').catch(() => ({ data: { total: '—' } })),
          api.get('/doctors').catch(() => ({ data: { total: '—' } })),
          api.get('/appointments').catch(() => ({ data: { total: '—', appointments: [] } })),
        ]);
        setStats({
          patients: p.data.total,
          doctors: d.data.total,
          appointments: a.data.total,
          pending: Array.isArray(a.data.appointments) ? a.data.appointments.filter(x => x.status === 'pending').length : '—',
        });
        setRecentAppts((a.data.appointments || []).slice(0, 8));
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className={'fade-up'}>
      <PageHeader title="Хяналтын самбар" subtitle={`Сайн байна уу, ${user?.email}`} />

      <div className={styles.statsGrid}>
        {[
          { icon: '🧑‍⚕️', value: stats.patients,     label: 'Нийт өвчтөн',       color: '#00d4aa' },
          { icon: '👨‍⚕️', value: stats.doctors,      label: 'Эмч нар',            color: '#3b9eff' },
          { icon: '📅',   value: stats.appointments, label: 'Цаг захиалга',       color: '#a78bfa' },
          { icon: '⏳',   value: stats.pending,      label: 'Хүлээгдэж байна',    color: '#ffb347' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard} style={{ '--c': s.color }}>
            <div className={styles.statGlow} />
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{loading ? <span className="spinner" /> : s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Сүүлийн цаг захиалгууд</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Өвчтөн</th>
              <th>Эмч</th>
              <th>Огноо</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" /></td></tr>
            ) : recentAppts.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Мэдээлэл байхгүй</td></tr>
            ) : recentAppts.map(a => (
              <tr key={a.id}>
                <td>{a.patient_first} {a.patient_last}</td>
                <td>{a.doctor_first} {a.doctor_last}</td>
                <td>{fmtDate(a.appointment_date)}</td>
                <td><span className={`badge ${a.status}`}>{statusLabel(a.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
