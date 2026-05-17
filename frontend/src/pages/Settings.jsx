import { useState } from 'react';
import { PageHeader } from '../components/UI';
import { useAuth } from '../AuthContext';
import styles from './Settings.module.css';

const roleLabel = role => ({ admin: 'Админ', doctor: 'Эмч', patient: 'Өвчтөн' }[role] || 'Хэрэглэгч');

export default function Settings({ theme, setTheme }) {
  const { user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const dark = theme === 'dark';
  const accountName = user?.username || user?.email || 'Хэрэглэгч';
  const accountEmail = user?.email || 'Имэйл байхгүй';

  return (
    <div className="fade-up">
      <PageHeader title="Тохиргоо" subtitle="Профайл болон харагдацын тохиргоо" />

      <div className={styles.settingsStack}>
        <section className={styles.settingsPanel} aria-label="Display settings">
          <button
            type="button"
            className={styles.settingsRow}
            onClick={() => setTheme(dark ? 'light' : 'dark')}
            aria-pressed={dark}
          >
            <span>Dark mode</span>
            <span className={`${styles.toggleSwitch} ${dark ? styles.toggleSwitchOn : ''}`} aria-hidden="true">
              <span className={styles.toggleKnob} />
            </span>
          </button>

          <button
            type="button"
            className={styles.settingsRow}
            onClick={() => setAccountOpen(v => !v)}
            aria-expanded={accountOpen}
          >
            <span>Account</span>
            <span className={`${styles.rowChevron} ${accountOpen ? styles.rowChevronOpen : ''}`} aria-hidden="true">›</span>
          </button>
        </section>

        <div className={`${styles.accountCollapse} ${accountOpen ? styles.accountCollapseOpen : ''}`}>
          <section className={styles.accountPanel} aria-label="Account settings" inert={accountOpen ? undefined : ''}>
            <div className={styles.accountHeader}>
              <div className={styles.accountAvatar}>
                {(accountName[0] || '?').toUpperCase()}
              </div>
              <div className={styles.accountText}>
                <h3>{accountName}</h3>
                <p>{accountEmail}</p>
              </div>
              <span className={`badge ${user?.role || 'patient'}`}>{roleLabel(user?.role)}</span>
            </div>
            <div className={styles.accountMeta}>
              <span>Нэвтэрсэн имэйл</span>
              <strong>{accountEmail}</strong>
            </div>
            <button type="button" className={styles.logoutBtn} onClick={logout}>
              Гарах
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
