import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M4 11.5 12 5l8 6.5" />
    <path d="M6.5 10.5V19h11v-8.5" />
    <path d="M9.4 19v-4.8h5.2V19" />
    <path d="M12 8.7v3.8" />
    <path d="M10.1 10.6h3.8" />
  </svg>
);

const PatientsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <circle cx="9" cy="8.2" r="3" />
    <path d="M3.8 19a5.2 5.2 0 0 1 10.4 0" />
    <circle cx="17.3" cy="9.6" r="2.3" />
    <path d="M14.5 17.9a4.1 4.1 0 0 1 5.7 0" />
    <path d="M18.9 4.2v4" />
    <path d="M16.9 6.2h4" />
  </svg>
);

const DoctorIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M8 3v5a4 4 0 0 0 8 0V3" />
    <path d="M6.5 3H8" />
    <path d="M16 3h1.5" />
    <path d="M12 12v2.7a4.8 4.8 0 0 0 9.6 0v-.9" />
    <circle cx="21" cy="12.6" r="1.6" />
  </svg>
);

const DepartmentIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M5 20V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8V20" />
    <path d="M3.5 20h17" />
    <path d="M9 8h6" />
    <path d="M12 11v5" />
    <path d="M9.5 13.5h5" />
  </svg>
);

const CalendarMedicalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3.5v4" />
    <path d="M16 3.5v4" />
    <path d="M4 10h16" />
    <path d="M12 13.1v4" />
    <path d="M10 15.1h4" />
  </svg>
);

const PrescriptionIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M7 3.8h7.5L19 8.3V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" />
    <path d="M14.3 3.8v4.7H19" />
    <path d="M8.7 12.2h5.6" />
    <path d="M8.7 15.3h3.3" />
    <path d="m14.4 18.5 3.2-3.2" />
    <path d="m14.5 15.4 3.1 3.1" />
  </svg>
);

const NavProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <circle cx="12" cy="8.7" r="3.1" />
    <path d="M6.3 19.4a5.9 5.9 0 0 1 11.4 0" />
    <path d="M19.5 5.2v3.6" />
    <path d="M17.7 7h3.6" />
  </svg>
);

const NavSettingsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.1, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" />
    <path d="M19.1 13.4a1.5 1.5 0 0 0 .3 1.65l.03.03a1.8 1.8 0 0 1-2.55 2.55l-.03-.03a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.38v.05a1.8 1.8 0 0 1-3.6 0v-.05a1.5 1.5 0 0 0-.9-1.38 1.5 1.5 0 0 0-1.65.3l-.03.03a1.8 1.8 0 0 1-2.55-2.55l.03-.03a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.38-.9h-.05a1.8 1.8 0 0 1 0-3.6h.05a1.5 1.5 0 0 0 1.38-.9 1.5 1.5 0 0 0-.3-1.65l-.03-.03a1.8 1.8 0 0 1 2.55-2.55l.03.03a1.5 1.5 0 0 0 1.65.3 1.5 1.5 0 0 0 .9-1.38v-.05a1.8 1.8 0 0 1 3.6 0v.05a1.5 1.5 0 0 0 .9 1.38 1.5 1.5 0 0 0 1.65-.3l.03-.03a1.8 1.8 0 0 1 2.55 2.55l-.03.03a1.5 1.5 0 0 0-.3 1.65 1.5 1.5 0 0 0 1.38.9h.05a1.8 1.8 0 0 1 0 3.6h-.05a1.5 1.5 0 0 0-1.38.9Z" />
  </svg>
);

const adminNav  = [
  { id: 'dashboard',    icon: <DashboardIcon />, label: 'Хяналтын самбар' },
  { id: 'patients',     icon: <PatientsIcon />, label: 'Өвчтөнүүд' },
  { id: 'departments',  icon: <DepartmentIcon />, label: 'Тасаг' },
  { id: 'doctors',      icon: <DoctorIcon />, label: 'Эмч нар' },
  { id: 'appointments', icon: <CalendarMedicalIcon />, label: 'Цаг захиалга' },
  { id: 'prescriptions', icon: <PrescriptionIcon />, label: 'Жор' },
  { id: 'settings',     icon: <NavSettingsIcon />, label: 'Тохиргоо' },
];
const doctorNav = [
  { id: 'dashboard',    icon: <DashboardIcon />, label: 'Хяналтын самбар' },
  { id: 'appointments', icon: <CalendarMedicalIcon />, label: 'Цаг захиалга' },
  { id: 'departments',  icon: <DepartmentIcon />, label: 'Тасаг' },
  { id: 'patients',     icon: <PatientsIcon />, label: 'Өвчтөнүүд' },
  { id: 'prescriptions', icon: <PrescriptionIcon />, label: 'Жор' },
  { id: 'profile',      icon: <NavProfileIcon />, label: 'Миний профайл' },
  { id: 'settings',     icon: <NavSettingsIcon />, label: 'Тохиргоо' },
];
const patientNav = [
  { id: 'dashboard',      icon: <DashboardIcon />, label: 'Хяналтын самбар' },
  { id: 'myAppointments', icon: <CalendarMedicalIcon />, label: 'Миний цагууд' },
  { id: 'departments',    icon: <DepartmentIcon />, label: 'Тасаг' },
  { id: 'prescriptions',  icon: <PrescriptionIcon />, label: 'Миний жор' },
  { id: 'profile',        icon: <NavProfileIcon />, label: 'Миний профайл' },
  { id: 'settings',       icon: <NavSettingsIcon />, label: 'Тохиргоо' },
];

const s = {
  sidebar:  { width:240, minHeight:'100vh', background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', position:'fixed', left:0, top:0, bottom:0, zIndex:100 },
  logo:     { display:'flex', alignItems:'center', gap:'.65rem', marginBottom:'2.5rem', padding:'0 .5rem' },
  logoIcon: { width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#00d4aa,#3b9eff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' },
  logoText: { fontFamily:"Roboto, serif", fontSize:'1.78rem', fontWeight:900, letterSpacing:'.02em', color:'var(--text)' },
  mobileBrandTitle:{ display:'block', fontFamily:"Playfair Display, serif", fontSize:'2rem', lineHeight:1.05, fontWeight:900, color:'var(--text)' },
  mobileBrandSub:{ display:'block', marginTop:'.3rem', fontSize:'.86rem', lineHeight:1.25, fontWeight:700, color:'var(--muted)' },
  nav:      { display:'flex', flexDirection:'column', gap:'.25rem' },
  navBtn:   { display:'flex', alignItems:'center', gap:'.7rem', padding:'.65rem .85rem', borderRadius:10, cursor:'pointer', border:'none', fontSize:'.875rem', fontWeight:600, fontFamily:'Manrope,sans-serif', textAlign:'left', width:'100%', transition:'background .18s ease, background-position .35s ease, color .18s ease, transform .12s ease, box-shadow .2s ease' },
  navBtnIdle: { background:'transparent', color:'var(--muted)' },
  navBtnHover:{ background:'linear-gradient(120deg, rgba(0,212,170,.16), rgba(47,107,255,.10))', color:'var(--accent)', transform:'translateX(3px)', boxShadow:'0 8px 18px rgba(0,212,170,.12)' },
  navBtnActive:{ background:'linear-gradient(120deg, rgba(0,212,170,.22), rgba(47,107,255,.14))', color:'var(--accent)', boxShadow:'inset 0 0 0 1px rgba(0,212,170,.10)' },
  navBtnIdleDark: { color:'#b8d0e7' },
  navBtnHoverDark:{ background:'linear-gradient(120deg, rgba(39,215,194,.2), rgba(112,168,255,.16))', color:'#dffcf8', boxShadow:'0 10px 24px rgba(39,215,194,.16)' },
  navBtnActiveDark:{ background:'linear-gradient(120deg, #27d7c2, #70a8ff, #27d7c2)', backgroundSize:'220% 100%', backgroundPosition:'0 0', color:'#03111d', boxShadow:'0 12px 28px rgba(39,215,194,.28)', textShadow:'0 1px 0 rgba(255,255,255,.28)' },
  navBtnActiveDarkHover:{ background:'linear-gradient(120deg, #27d7c2, #70a8ff, #27d7c2)', backgroundSize:'220% 100%', backgroundPosition:'100% 0', transform:'translateY(-2px)', boxShadow:'0 18px 38px rgba(112,168,255,.32)' },
  footer:   { marginTop:'auto', borderTop:'1px solid var(--border)', paddingTop:'1rem' },
  contact:  { borderTop:'1px solid var(--border)', paddingTop:'.9rem', marginTop:'1rem' },
  contactTitle: { fontSize:'.98rem', fontWeight:700, color:'var(--accent2)', letterSpacing:'.01em', marginBottom:'.55rem' },
  contactItem: { display:'grid', gap:'.18rem', fontSize:'.82rem', color:'var(--text)', marginBottom:'.65rem', lineHeight:1.55, paddingLeft:'.45rem', borderLeft:'2px solid rgba(64, 100, 189, 0.18)' },
  contactLabel: { color:'var(--muted)', fontSize:'.76rem', fontWeight:800, lineHeight:1.2 },
  contactValue: { color:'var(--text)', fontSize:'.84rem', fontWeight:500, lineHeight:1.55, overflowWrap:'anywhere' },
  footerProfile:{ width:'100%', minHeight:48, padding:'.55rem .7rem', border:'0', borderRadius:14, background:'var(--surface2)', color:'var(--text)', cursor:'pointer', display:'flex', alignItems:'center', gap:'.7rem', fontFamily:'Manrope,sans-serif', fontSize:'.88rem', fontWeight:800, transition:'transform .14s ease, box-shadow .2s ease, background .2s ease' },
  footerProfileActive:{ transform:'translateY(-1px)', background:'color-mix(in srgb, var(--accent) 10%, var(--surface2))', boxShadow:'0 14px 28px rgba(39,215,194,.14)' },
  footerProfileIcon:{ width:34, height:34, borderRadius:12, background:'linear-gradient(135deg,#27d7c2,#70a8ff)', color:'#03111d', display:'inline-flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto', boxShadow:'0 8px 18px rgba(39,215,194,.22)' },
  footerProfileIconPhoto:{ overflow:'hidden', background:'transparent', color:'inherit' },
  profileShortcut:{ position:'fixed', top:'.8rem', right:'.8rem', zIndex:190, width:44, height:44, border:0, borderRadius:14, background:'linear-gradient(135deg,#27d7c2,#70a8ff)', color:'#03111d', display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 14px 34px rgba(39,215,194,.26)', fontFamily:'Manrope,sans-serif', fontSize:'1rem', fontWeight:900, transition:'transform .14s ease, box-shadow .2s ease' },
  profileShortcutPhoto:{ padding:0, overflow:'hidden', background:'transparent' },
  profileShortcutActive:{ transform:'translateY(-1px)', boxShadow:'0 18px 38px rgba(112,168,255,.32)' },
  profilePhotoImg:{ width:'100%', height:'100%', display:'block', objectFit:'cover' },
  overlay:{ position:'fixed', inset:0, background:'rgba(2, 8, 18, .58)', backdropFilter:'blur(6px)', zIndex:210 },
  bottomNav:{ position:'fixed', left:'50%', bottom:'calc(.65rem + env(safe-area-inset-bottom))', zIndex:190, width:'min(13.25rem, calc(100vw - 2rem))', minHeight:62, transform:'translateX(-50%)', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', alignItems:'center', gap:'.35rem', padding:'.44rem .58rem', borderRadius:22, background:'rgba(255, 255, 255, .92)', border:'1px solid rgba(39, 215, 194, .18)', boxShadow:'0 12px 30px rgba(15, 23, 42, .18), inset 0 1px 0 rgba(255, 255, 255, .9)', backdropFilter:'blur(16px)' },
  bottomNavDark:{ background:'linear-gradient(135deg, rgba(14, 35, 56, .96), rgba(8, 24, 40, .94))', border:'1px solid rgba(112, 168, 255, .18)', boxShadow:'0 16px 36px rgba(0, 0, 0, .34), inset 0 1px 0 rgba(255, 255, 255, .08)' },
  bottomNavBtn:{ width:54, height:50, margin:'0 auto', border:0, borderRadius:16, background:'transparent', color:'#7b93a8', display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'transform .14s ease, color .18s ease, background .18s ease, box-shadow .2s ease' },
  bottomNavBtnDark:{ color:'#8fb0ca' },
  bottomNavBtnActive:{ color:'#04121d' },
  bottomNavBtnHover:{ transform:'translateY(-1px)', color:'#0fb7a7' },
  bottomNavBtnHoverDark:{ color:'#dffcf8' },
  bottomNavIcon:{ width:32, height:32, borderRadius:11, display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .18s ease, color .18s ease, box-shadow .2s ease, transform .14s ease' },
  bottomNavIconActive:{ background:'linear-gradient(135deg, #27d7c2, #70a8ff)', color:'#04121d', boxShadow:'0 8px 18px rgba(39, 215, 194, .32)' },
};

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6.5 10v8h11v-8" />
    <path d="M9.5 18v-5h5v5" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <rect x="4" y="4" width="6" height="6" rx="1.6" />
    <rect x="14" y="4" width="6" height="6" rx="1.6" />
    <rect x="4" y="14" width="6" height="6" rx="1.6" />
    <rect x="14" y="14" width="6" height="6" rx="1.6" />
  </svg>
);

const SettingsGearIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" />
    <path d="M19.1 13.4a1.5 1.5 0 0 0 .3 1.65l.03.03a1.8 1.8 0 0 1-2.55 2.55l-.03-.03a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.38v.05a1.8 1.8 0 0 1-3.6 0v-.05a1.5 1.5 0 0 0-.9-1.38 1.5 1.5 0 0 0-1.65.3l-.03.03a1.8 1.8 0 0 1-2.55-2.55l.03-.03a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.38-.9h-.05a1.8 1.8 0 0 1 0-3.6h.05a1.5 1.5 0 0 0 1.38-.9 1.5 1.5 0 0 0-.3-1.65l-.03-.03a1.8 1.8 0 0 1 2.55-2.55l.03.03a1.5 1.5 0 0 0 1.65.3 1.5 1.5 0 0 0 .9-1.38v-.05a1.8 1.8 0 0 1 3.6 0v.05a1.5 1.5 0 0 0 .9 1.38 1.5 1.5 0 0 0 1.65-.3l.03-.03a1.8 1.8 0 0 1 2.55 2.55l-.03.03a1.5 1.5 0 0 0-.3 1.65 1.5 1.5 0 0 0 1.38.9h.05a1.8 1.8 0 0 1 0 3.6h-.05a1.5 1.5 0 0 0-1.38.9Z" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="9" r="2.7" />
    <path d="M7.6 17.2a5.1 5.1 0 0 1 8.8 0" />
  </svg>
);

const profilePhotoKey = user => `hms_profile_photo_${user?.id || user?.email || 'guest'}`;

export default function Sidebar({ page, setPage, theme = 'light' }) {
  const { user } = useAuth();
  const [hoveredNav, setHoveredNav] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredBottom, setHoveredBottom] = useState('');
  const [profileHover, setProfileHover] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileReturnPage, setProfileReturnPage] = useState('dashboard');
  const nav = user?.role === 'admin' ? adminNav : user?.role === 'doctor' ? doctorNav : patientNav;
  const visibleNav = isMobile ? nav.filter(item => item.id !== 'dashboard') : nav;
  const menuPageActive = page !== 'dashboard' && page !== 'settings';
  const bottomNav = [
    { id: 'dashboard', label: 'Нүүр', icon: <HomeIcon />, action: () => setPage('dashboard') },
    { id: 'menu', label: 'Цэс', icon: <GridIcon />, action: () => setMenuOpen(v => !v) },
    { id: 'settings', label: 'Тохиргоо', icon: <SettingsGearIcon />, action: () => setPage('settings') }
  ];

  const resetHoverStates = useCallback(() => {
    setHoveredNav('');
    setHoveredBottom('');
    setProfileHover(false);
  }, []);

  useEffect(() => {
    resetHoverStates();
  }, [resetHoverStates, theme]);

  useEffect(() => {
    const loadPhoto = event => {
      if (event?.detail && 'photo' in event.detail) {
        setProfilePhoto(event.detail.photo || '');
        return;
      }
      try {
        setProfilePhoto(localStorage.getItem(profilePhotoKey(user)) || '');
      } catch {
        setProfilePhoto('');
      }
    };
    loadPhoto();
    window.addEventListener('hms-profile-photo-change', loadPhoto);
    return () => window.removeEventListener('hms-profile-photo-change', loadPhoto);
  }, [user]);

  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 900px)');
    if (!media) return undefined;
    const sync = event => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  const mobileSidebar = isMobile ? {
    width: 'min(82vw, 320px)',
    minHeight: '100vh',
    right: 'auto',
    padding: '1.35rem .9rem calc(1.2rem + env(safe-area-inset-bottom))',
    borderRight: '1px solid var(--border)',
    borderTop: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    overflowX: 'hidden',
    overflowY: 'auto',
    transform: menuOpen ? 'translateX(0)' : 'translateX(-105%)',
    transition: 'transform .22s ease',
    zIndex: 240,
    boxShadow: menuOpen ? '24px 0 60px rgba(0, 0, 0, .34)' : 'none'
  } : {};
  const mobileLogo = isMobile ? { marginBottom: '1.75rem', padding: '0 .65rem' } : {};
  const mobileLogoText = isMobile ? { maxWidth: 250 } : {};
  const mobileNav = isMobile ? { flexDirection: 'column', gap: '.45rem', width: '100%', overflowX: 'visible', paddingBottom: '.4rem' } : {};
  const mobileNavBtn = isMobile ? { flex: '0 0 auto', width: '100%', minWidth: 0, flexDirection: 'row', justifyContent: 'flex-start', gap: '.85rem', padding: '.82rem .9rem', borderRadius: 16, fontSize: '.96rem', textAlign: 'left', whiteSpace: 'normal' } : {};
  const mobileIconWrap = isMobile ? { width: 36, height: 36, borderRadius: 13, background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent2)', border: '1px solid color-mix(in srgb, var(--accent) 12%, transparent)' } : {};
  const mobileIconWrapDark = isMobile && theme === 'dark' ? { background: 'rgba(39, 215, 194, .10)', color: '#bfeeff', border: '1px solid rgba(112, 168, 255, .16)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, .06), 0 10px 24px rgba(39, 215, 194, .08)' } : {};
  const mobileIconWrapActive = isMobile ? { background: 'linear-gradient(135deg, #27d7c2, #70a8ff)', color: '#03111d', border: '1px solid transparent', boxShadow: '0 12px 26px rgba(112, 168, 255, .24)' } : {};
  const mobileContact = isMobile ? { marginTop: '1rem', padding: '.95rem', borderTop: '1px solid color-mix(in srgb, var(--border) 72%, transparent)', borderRadius: 18, background: 'color-mix(in srgb, var(--surface2) 72%, transparent)' } : {};
  const mobileContactTitle = isMobile ? { fontSize: '1.05rem', marginBottom: '.7rem' } : {};
  const mobileContactItem = isMobile ? { fontSize: '.84rem', lineHeight: 1.6, marginBottom: '.65rem' } : {};

  return (
    <>
    {isMobile && menuOpen && <div style={s.overlay} onClick={() => setMenuOpen(false)} />}
    {isMobile && (
      <button
        type="button"
        aria-label="Профайл"
        title="Профайл"
        style={{ ...s.profileShortcut, ...(profilePhoto ? s.profileShortcutPhoto : {}), ...(profileHover || page === 'profile' ? s.profileShortcutActive : {}) }}
        onClick={() => {
          if (page === 'profile') {
            setPage(profileReturnPage || 'dashboard');
          } else {
            setProfileReturnPage(page);
            setPage('profile');
          }
          setMenuOpen(false);
        }}
        onMouseEnter={() => setProfileHover(true)}
        onMouseLeave={() => setProfileHover(false)}
      >
        {profilePhoto ? <img src={profilePhoto} alt="" style={s.profilePhotoImg} /> : <ProfileIcon />}
      </button>
    )}
    <aside style={{ ...s.sidebar, ...mobileSidebar }}>
      <div style={{ ...s.logo, ...mobileLogo }}>
        {isMobile ? (
          <span style={{ ...s.logoText, ...mobileLogoText }}>
            <span style={s.mobileBrandTitle}>МедСистем</span>
            <span style={s.mobileBrandSub}>Эмнэлгийн удирдлагын систем</span>
          </span>
        ) : (
          <span style={s.logoText}>Hospital Management System</span>
        )}
      </div>
      <nav style={{ ...s.nav, ...mobileNav }}>
        {visibleNav.map(item => {
          const active = page === item.id;
          const hovered = hoveredNav === item.id;
          return (
          <button
            key={item.id}
            onClick={() => { setPage(item.id); if (isMobile) setMenuOpen(false); }}
            onMouseEnter={() => setHoveredNav(item.id)}
            onMouseLeave={() => setHoveredNav('')}
            style={{
              ...s.navBtn,
              ...mobileNavBtn,
              ...s.navBtnIdle,
              ...(theme === 'dark' ? s.navBtnIdleDark : {}),
              ...(active ? s.navBtnActive : {}),
              ...(theme === 'dark' && active ? s.navBtnActiveDark : {}),
              ...(hovered ? s.navBtnHover : {}),
              ...(theme === 'dark' && hovered ? s.navBtnHoverDark : {}),
              ...(theme === 'dark' && active && hovered ? s.navBtnActiveDarkHover : {}),
              ...(active && hovered ? { color: theme === 'dark' ? '#03111d' : 'var(--accent)' } : {})
            }}
          >
            <span style={{ width:22, height:22, display:'inline-flex', alignItems:'center', justifyContent:'center', ...mobileIconWrap, ...mobileIconWrapDark, ...(active || hovered ? mobileIconWrapActive : {}) }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        );})}
      </nav>
      {user?.role === 'patient' && (
        <div style={{ ...s.contact, ...mobileContact }}>
          <div style={{ ...s.contactTitle, ...mobileContactTitle }}>Холбоо барих</div>
          <div style={{ ...s.contactItem, ...mobileContactItem }}>
            <span style={s.contactLabel}>Хаяг</span>
            <span style={s.contactValue}>Энхтайвны өргөн чөлөө, Шангри-Ла молл 1010</span>
          </div>
          <div style={{ ...s.contactItem, ...mobileContactItem }}>
            <span style={s.contactLabel}>Утас</span>
            <span style={s.contactValue}>7011-2233</span>
          </div>
          <div style={{ ...s.contactItem, ...mobileContactItem }}>
            <span style={s.contactLabel}>Имэйл</span>
            <span style={s.contactValue}>Suld@hospital.mn</span>
          </div>
        </div>
      )}
      {!isMobile && (
        <div style={s.footer}>
          <button
            type="button"
            aria-label="Профайл"
            title="Профайл"
            style={{ ...s.footerProfile, ...(profileHover || page === 'profile' ? s.footerProfileActive : {}) }}
            onClick={() => setPage('profile')}
            onMouseEnter={() => setProfileHover(true)}
            onMouseLeave={() => setProfileHover(false)}
          >
            <span style={{ ...s.footerProfileIcon, ...(profilePhoto ? s.footerProfileIconPhoto : {}) }}>
              {profilePhoto ? <img src={profilePhoto} alt="" style={s.profilePhotoImg} /> : <ProfileIcon />}
            </span>
            <span>Профайл</span>
          </button>
        </div>
      )}
    </aside>
    {isMobile && (
      <nav style={{ ...s.bottomNav, ...(theme === 'dark' ? s.bottomNavDark : {}) }} aria-label="Mobile quick navigation">
        {bottomNav.map(item => {
          const active = item.id === 'menu' ? menuOpen || menuPageActive : page === item.id;
          const hovered = hoveredBottom === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              title={item.label}
              onClick={() => {
                item.action();
                if (item.id !== 'menu') setMenuOpen(false);
              }}
              onMouseEnter={() => setHoveredBottom(item.id)}
              onMouseLeave={() => setHoveredBottom('')}
              style={{
                ...s.bottomNavBtn,
                ...(theme === 'dark' ? s.bottomNavBtnDark : {}),
                ...(hovered ? s.bottomNavBtnHover : {}),
                ...(theme === 'dark' && hovered ? s.bottomNavBtnHoverDark : {}),
                ...(active ? s.bottomNavBtnActive : {})
              }}
            >
              <span style={{ ...s.bottomNavIcon, ...(active ? s.bottomNavIconActive : {}) }}>{item.icon}</span>
            </button>
          );
        })}
      </nav>
    )}
    </>
  );
}
