import { useAuth } from '../AuthContext';

const roleLabel = r => ({ admin: 'Админ', doctor: 'Эмч', patient: 'Өвчтөн' }[r] || r);

const adminNav  = [
  { id: 'dashboard',    icon: '📊', label: 'Хяналтын самбар' },
  { id: 'patients',     icon: '🧑‍⚕️', label: 'Өвчтөнүүд' },
  { id: 'doctors',      icon: '👨‍⚕️', label: 'Эмч нар' },
  { id: 'appointments', icon: '📅', label: 'Цаг захиалга' },
];
const doctorNav = [
  { id: 'dashboard',    icon: '📊', label: 'Хяналтын самбар' },
  { id: 'appointments', icon: '📅', label: 'Цаг захиалга' },
  { id: 'patients',     icon: '🧑‍⚕️', label: 'Өвчтөнүүд' },
];
const patientNav = [
  { id: 'dashboard',      icon: '📊', label: 'Хяналтын самбар' },
  { id: 'myAppointments', icon: '📅', label: 'Миний цагууд' },
];

const s = {
  sidebar:  { width:240, minHeight:'100vh', background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', position:'fixed', left:0, top:0, bottom:0, zIndex:100 },
  logo:     { display:'flex', alignItems:'center', gap:'.65rem', marginBottom:'2.5rem', padding:'0 .5rem' },
  logoIcon: { width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#00d4aa,#3b9eff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' },
  logoText: { fontFamily:"'Playfair Display',serif", fontSize:'1.15rem' },
  nav:      { display:'flex', flexDirection:'column', gap:'.25rem' },
  footer:   { marginTop:'auto', borderTop:'1px solid var(--border)', paddingTop:'1rem' },
  badge:    { display:'flex', alignItems:'center', gap:'.7rem', padding:'.65rem .85rem', borderRadius:10, background:'var(--surface2)', marginBottom:'.5rem' },
  avatar:   { width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#00d4aa,#3b9eff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', fontWeight:800, color:'#060d1a', flexShrink:0 },
  logoutBtn:{ width:'100%', padding:'.55rem', background:'none', border:'1px solid var(--border)', borderRadius:9, color:'var(--muted)', cursor:'pointer', fontSize:'.82rem', fontFamily:'Manrope,sans-serif' },
};

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth();
  const nav = user?.role === 'admin' ? adminNav : user?.role === 'doctor' ? doctorNav : patientNav;

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <div style={s.logoIcon}>🏥</div>
        <span style={s.logoText}>МедСистем</span>
      </div>
      <nav style={s.nav}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            display:'flex', alignItems:'center', gap:'.7rem',
            padding:'.65rem .85rem', borderRadius:10, cursor:'pointer',
            background: page === item.id ? 'rgba(0,212,170,.1)' : 'none',
            border:'none', color: page === item.id ? 'var(--accent)' : 'var(--muted)',
            fontSize:'.875rem', fontWeight:500, fontFamily:'Manrope,sans-serif',
            textAlign:'left', width:'100%', transition:'all .15s'
          }}>
            <span style={{ fontSize:'1.05rem', width:22, textAlign:'center' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={s.footer}>
        <div style={s.badge}>
          <div style={s.avatar}>{user?.email?.[0]?.toUpperCase()}</div>
          <div style={{ overflow:'hidden' }}>
            <p style={{ fontSize:'.78rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</p>
            <span className={`badge ${user?.role}`}>{roleLabel(user?.role)}</span>
          </div>
        </div>
        <button style={s.logoutBtn} onClick={logout}>🚪 Гарах</button>
      </div>
    </aside>
  );
}