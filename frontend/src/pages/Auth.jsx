import { useState, useEffect } from 'react';
import api, { API_ORIGIN } from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import { Select } from '../components/UI';
import styles from './Auth.module.css';

function EyeIcon({ off = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" className={styles.logoSvg} aria-hidden="true">
      <defs>
        <linearGradient id="medLogoGrad" x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f6bff" />
          <stop offset="1" stopColor="#00b3a4" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="13" fill="url(#medLogoGrad)" />
      <path d="M21 13h6v8h8v6h-8v8h-6v-8h-8v-6h8z" fill="#fff" />
      <path d="M12 35h6l2.5-5 4.5 8 3.5-6H36" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".92" />
      <circle cx="36.5" cy="12.5" r="3.5" fill="#dffcf8" opacity=".9" />
    </svg>
  );
}

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', password: '', role: 'patient' });
  const { login } = useAuth();
  const toast = useToast();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // OAuth callback — URL-ээс token авна
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      toast('Google-ээр нэвтрэхэд алдаа гарлаа.', 'error');
      window.history.replaceState({}, '', '/');
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(user, token);
        window.history.replaceState({}, '', '/');
        toast('Амжилттай нэвтэрлээ!');
      } catch(e) {
        toast('Нэвтрэхэд алдаа гарлаа.', 'error');
      }
    }
  }, [login, toast]);

  const handleLogin = async () => {
    if (!form.email || !form.password) return toast('Бүх талбарыг бөглөнө үү.', 'error');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      login(data.user, data.token);
      toast('Амжилттай нэвтэрлээ!');
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) return toast('Имэйл болон нууц үгээ бөглөнө үү.', 'error');
    setLoading(true);
    try {
      await api.post('/auth/register', {
        ...form,
        username: form.username || form.email.split('@')[0]
      });
      toast('Бүртгэл амжилттай! Нэвтэрнэ үү.');
      setTab('login');
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className={`${styles.wrap} ${tab === 'register' ? styles.registerMode : ''}`}>
      <div className={styles.bg} />
      <div className={`${styles.card} ${tab === 'register' ? styles.registerCard : ''} fade-up`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><LogoMark /></div>
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
          <label className={styles.label}>{tab === 'login' ? 'Имэйл эсвэл нэвтрэх нэр' : 'Имэйл'}</label>
          <input className={styles.input} type={tab === 'login' ? 'text' : 'email'} placeholder={tab === 'login' ? 'example@hospital.mn эсвэл Temuulen' : 'example@hospital.mn'} value={form.email} onChange={set('email')} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
        </div>
        {tab === 'register' && (
          <div className={styles.fields}>
            <label className={styles.label}>Нэвтрэх нэр</label>
            <input className={styles.input} type="text" placeholder="Temuulen" value={form.username} onChange={set('username')} onKeyDown={e => e.key === 'Enter' && handleRegister()} />
          </div>
        )}
        <div className={styles.fields}>
          <label className={styles.label}>Нууц үг</label>
          <div className={styles.passwordWrap}>
            <input className={styles.passwordInput} type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харах'}
              title={showPassword ? 'Нуух' : 'Харах'}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>
        </div>

        {tab === 'register' && (
          <div className={styles.fields}>
            <label className={styles.label}>Эрх</label>
            <Select className={styles.authSelect} value={form.role} onChange={set('role')}>
              <option value="patient">Өвчтөн</option>
              <option value="doctor">Эмч</option>
              <option value="admin">Админ</option>
            </Select>
          </div>
        )}

        <button className={styles.btn} disabled={loading} onClick={tab === 'login' ? handleLogin : handleRegister}>
          {loading ? <span className="spinner" /> : tab === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
        </button>

        {/* ── Хэрэв нэвтрэх tab байвал OAuth товчийг харуулна ── */}
        {tab === 'login' && (
          <>
            {/* Хуваагч шугам */}
            <div className={styles.divider}>
              <div />
              <span>эсвэл</span>
              <div />
            </div>

            {/* Google */}
            <a
              href={`${API_ORIGIN}/api/auth/google`}
              className={styles.googleBtn}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google-ээр нэвтрэх
            </a>

          </>
        )}
      </div>
    </div>
  );
}
