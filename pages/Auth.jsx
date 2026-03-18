import { useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import styles from './Auth.module.css';

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'patient' });
  const { login } = useAuth();
  const toast = useToast();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async () => {
    if (!form.email || !form.password) return toast('Бүх талбарыг бөглөнө үү.', 'error');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      login(data.user, data.token);
      toast('Амжилттай нэвтэрлээ! 🎉');
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) return toast('Бүх талбарыг бөглөнө үү.', 'error');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast('Бүртгэл амжилттай! Нэвтэрнэ үү.');
      setTab('login');
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.bg} />
      <div className={styles.card + ' fade-up'}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🏥</div>
          <div>
            <h1 className={styles.logoTitle}>МедСистем</h1>
            <p className={styles.logoSub}>Эмнэлгийн удирдлагын систем</p>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={styles.tab + (tab === 'login' ? ' ' + styles.active : '')} onClick={() => setTab('login')}>Нэвтрэх</button>
          <button className={styles.tab + (tab === 'register' ? ' ' + styles.active : '')} onClick={() => setTab('register')}>Бүртгүүлэх</button>
        </div>

        <div className={styles.fields}>
          <label className={styles.label}>Имэйл</label>
          <input className={styles.input} type="email" value={form.email} onChange={set('email')} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
        </div>
        <div className={styles.fields}>
          <label className={styles.label}>Нууц үг</label>
          <input className={styles.input} type="password" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
        </div>

        {tab === 'register' && (
          <div className={styles.fields}>
            <label className={styles.label}>Эрх</label>
            <select className={styles.input} value={form.role} onChange={set('role')}>
              <option value="patient">Өвчтөн</option>
              <option value="doctor">Эмч</option>
              <option value="admin">Админ</option>
            </select>
          </div>
        )}

        <button className={styles.btn} disabled={loading} onClick={tab === 'login' ? handleLogin : handleRegister}>
          {loading ? <span className="spinner" /> : tab === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
        </button>
      </div>
    </div>
  );
}
