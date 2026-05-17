import { useEffect, useState } from 'react';
import api from '../api';
import { PageHeader } from '../components/UI';
import { useAuth } from '../AuthContext';
import styles from './Dashboard.module.css';

const fmtDate = d => d ? new Date(d).toLocaleString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
const statusLabel = s => ({ pending: 'Хүлээгдэж байна', confirmed: 'Баталгаажсан', completed: 'Дууссан', cancelled: 'Цуцлагдсан' })[s] || s;

const PatientsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="9" cy="8.2" r="3" />
    <path d="M3.8 19a5.2 5.2 0 0 1 10.4 0" />
    <circle cx="17.3" cy="9.6" r="2.3" />
    <path d="M14.5 17.9a4.1 4.1 0 0 1 5.7 0" />
    <path d="M18.9 4.2v4" />
    <path d="M16.9 6.2h4" />
  </svg>
);

const DoctorIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 3v5a4 4 0 0 0 8 0V3" />
    <path d="M6.5 3H8" />
    <path d="M16 3h1.5" />
    <path d="M12 12v2.7a4.8 4.8 0 0 0 9.6 0v-.9" />
    <circle cx="21" cy="12.6" r="1.6" />
  </svg>
);

const CalendarMedicalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3.5v4" />
    <path d="M16 3.5v4" />
    <path d="M4 10h16" />
    <path d="M12 13.1v4" />
    <path d="M10 15.1h4" />
  </svg>
);

const PendingIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 3.8h10" />
    <path d="M8.2 3.8v4.6c0 1.25.56 2.42 1.52 3.2L12 13.4l2.28-1.8a4.1 4.1 0 0 0 1.52-3.2V3.8" />
    <path d="M8.2 20.2v-4.6c0-1.25.56-2.42 1.52-3.2L12 10.6l2.28 1.8a4.1 4.1 0 0 1 1.52 3.2v4.6" />
    <path d="M7 20.2h10" />
    <path d="M10 17h4" />
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: '—', doctors: '—', todayAppointments: '—', pendingAppointments: '—' });
  const [recentAppts, setRecentAppts] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.stats || {});
        setRecentAppts(data.recentAppointments || []);
        setRecentPrescriptions(data.recentPrescriptions || []);
      } catch {
        setStats({ patients: '—', doctors: '—', todayAppointments: '—', pendingAppointments: '—' });
        setRecentAppts([]);
        setRecentPrescriptions([]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className={'fade-up'}>
      <PageHeader title="Хяналтын самбар"  />

      <div className={styles.statsGrid}>
        {(user?.role === 'patient'
          ? [
              { key: 'todayAppointments', icon: <CalendarMedicalIcon />, value: stats.todayAppointments, label: 'Өнөөдрийн цаг', color: '#70a8ff' },
              { key: 'pending', icon: <PendingIcon />, value: stats.pendingAppointments, label: 'Хүлээгдэж байна', color: '#27d7c2' },
            ]
          : [
              { key: 'patients', icon: <PatientsIcon />, value: stats.patients, label: 'Нийт өвчтөн', color: '#38bdf8' },
              { key: 'doctors', icon: <DoctorIcon />, value: stats.doctors, label: 'Нийт эмч', color: '#27d7c2' },
              { key: 'todayAppointments', icon: <CalendarMedicalIcon />, value: stats.todayAppointments, label: 'Өнөөдрийн цаг', color: '#70a8ff' },
              { key: 'pending', icon: <PendingIcon />, value: stats.pendingAppointments, label: 'Хүлээгдэж байна', color: '#27d7c2' },
            ]
        ).map((s, i) => (
          <div
            key={i}
            className={`${styles.statCard} ${s.key === 'doctors' ? styles.statCardCompact : ''}`}
            style={{ '--c': s.color }}
          >
            <div className={styles.statGlow} />
            <div className={styles.statTop}>
              <div className={styles.statIcon}>
                {s.icon}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
            <div className={styles.statValue}>{loading ? <span className="spinner" /> : s.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Сүүлийн цаг захиалгууд</h3>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                {user?.role === 'patient' ? (
                  <>
                    <th>№</th><th>Эмч</th><th>Тасаг</th><th>Өрөө</th><th>Огноо</th><th>Статус</th>
                  </>
                ) : (
                  <>
                    <th>№</th><th>Өвчтөн</th><th>Утас</th><th>Эмч</th><th>Өрөө</th><th>Огноо</th><th>Статус</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={user?.role === 'patient' ? 6 : 7} style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" /></td></tr>
              ) : recentAppts.length === 0 ? (
                <tr><td colSpan={user?.role === 'patient' ? 6 : 7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Мэдээлэл байхгүй</td></tr>
              ) : recentAppts.map((a, i) => (
                <tr key={a.id}>
                  {user?.role === 'patient' ? (
                    <>
                      <td>{i + 1}</td>
                      <td>{a.doctor_first} {a.doctor_last}</td>
                      <td>{a.specialization || '—'}</td>
                      <td>{a.room_number || '—'}</td>
                      <td>{fmtDate(a.appointment_date)}</td>
                      <td><span className={`badge ${a.status}`}>{statusLabel(a.status)}</span></td>
                    </>
                  ) : (
                    <>
                      <td>{i + 1}</td>
                      <td>{a.patient_first} {a.patient_last}</td>
                      <td>{a.patient_phone || '—'}</td>
                      <td>{a.doctor_first} {a.doctor_last}</td>
                      <td>{a.room_number || '—'}</td>
                      <td>{fmtDate(a.appointment_date)}</td>
                      <td><span className={`badge ${a.status}`}>{statusLabel(a.status)}</span></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.mobileAppointmentList}>
            {loading ? (
              <div className={styles.mobileAppointmentCard}>Ачаалж байна...</div>
            ) : recentAppts.length === 0 ? (
              <div className={styles.mobileAppointmentCard}>Мэдээлэл байхгүй</div>
            ) : recentAppts.map((a, i) => (
              <div className={styles.mobileAppointmentCard} key={a.id}>
                <div className={styles.mobileAppointmentTop}>
                  <span>#{i + 1}</span>
                  <span className={`badge ${a.status}`}>{statusLabel(a.status)}</span>
                </div>
                <strong>
                  {user?.role === 'patient'
                    ? `${a.doctor_first} ${a.doctor_last}`
                    : `${a.patient_first} ${a.patient_last}`}
                </strong>
                <div className={styles.mobileAppointmentMeta}>
                  {user?.role === 'patient' ? (
                    <>
                      <span>{a.specialization || 'Тасаг —'}</span>
                      <span>Өрөө: {a.room_number || '—'}</span>
                    </>
                  ) : (
                    <>
                      <span>{a.patient_phone || 'Утас —'}</span>
                      <span>{a.doctor_first} {a.doctor_last}</span>
                    </>
                  )}
                </div>
                <small>{fmtDate(a.appointment_date)}</small>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.prescriptionCard}>
          <div className={styles.tableHeader}>
            <h3>Сүүлийн жорууд</h3>
          </div>
          {loading ? (
            <div className={styles.emptyState}><span className="spinner" /></div>
          ) : recentPrescriptions.length === 0 ? (
            <div className={styles.emptyState}>Жор байхгүй</div>
          ) : (
            <div className={styles.prescriptionList}>
              {recentPrescriptions.map(p => (
                <div key={p.id} className={styles.prescriptionItem}>
                  <div className={styles.prescriptionTop}>
                    <strong>{p.medication}</strong>
                    <span>{fmtDate(p.issued_at)}</span>
                  </div>
                  <p>{p.dosage} · {p.duration}</p>
                  <small>
                    {user?.role === 'patient'
                      ? `Эмч: ${p.doctor_first || ''} ${p.doctor_last || ''}`.trim()
                      : `Өвчтөн: ${p.patient_first || ''} ${p.patient_last || ''}`.trim()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
