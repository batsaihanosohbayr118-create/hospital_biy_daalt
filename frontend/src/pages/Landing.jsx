import { useEffect, useRef, useState } from 'react';
import styles from './Landing.module.css';

function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" className={styles.logoSvg} aria-hidden="true">
      <defs>
        <linearGradient id="landingLogoGrad" x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f6bff" />
          <stop offset="1" stopColor="#00b3a4" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="13" fill="url(#landingLogoGrad)" />
      <path d="M21 13h6v8h8v6h-8v8h-6v-8h-8v-6h8z" fill="#fff" />
      <path d="M12 35h6l2.5-5 4.5 8 3.5-6H36" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".92" />
      <circle cx="36.5" cy="12.5" r="3.5" fill="#dffcf8" opacity=".9" />
    </svg>
  );
}

function FeatureIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.featureIcon}>
      <path d={d} />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.btnIcon}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function DoctorSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.btnIcon}>
      <circle cx="10" cy="8.5" r="3.2" />
      <path d="M4.5 19a5.6 5.6 0 0 1 11 0" />
      <circle cx="18" cy="16.5" r="2.6" />
      <path d="M20 18.5 22 20.5" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.miniCardIconSvg}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4.2" height="6" rx="1.6" />
      <rect x="16.8" y="13" width="4.2" height="6" rx="1.6" />
      <path d="M19.5 19.5v.6a2.9 2.9 0 0 1-2.9 2.9H14" />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.banIconSvg}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M4 10h16" />
      <path d="M12 13v5" />
      <path d="M9.5 15.5h5" />
    </svg>
  );
}

function PersonPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.banBadgeSvg}>
      <circle cx="10" cy="9" r="3.6" />
      <path d="M3.8 20a6.3 6.3 0 0 1 12.4 0" />
      <path d="M18.5 8.5v5" />
      <path d="M16 11h5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.footerContactIconSvg}>
      <path d="M12 21.5c4-4 7-7.7 7-11.5a7 7 0 1 0-14 0c0 3.8 3 7.5 7 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.footerContactIconSvg}>
      <path d="M5 4.5h3.2l1.3 4.4-2.1 1.7a13 13 0 0 0 5.9 5.9l1.7-2.1 4.4 1.3V19a1.7 1.7 0 0 1-1.8 1.7A15.3 15.3 0 0 1 3.3 6.3 1.7 1.7 0 0 1 5 4.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.footerContactIconSvg}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.4" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.miniCardIconSvg}>
      <path d="M12 3.2 19 6v5.4c0 4.6-3 7.9-7 9.4-4-1.5-7-4.8-7-9.4V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  );
}

function UsersGroupIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.miniCardIconSvg}>
      <circle cx="9" cy="8.4" r="3" />
      <path d="M3.8 19a5.2 5.2 0 0 1 10.4 0" />
      <circle cx="17.3" cy="9.6" r="2.3" />
      <path d="M14.5 17.9a4.1 4.1 0 0 1 5.7 0" />
    </svg>
  );
}

const HERO_MINI_CARDS = [
  { icon: <HeadsetIcon />, title: '24/7', desc: 'Онлайн дэмжлэг' },
  { icon: <ShieldCheckIcon />, title: 'Баталгаат', desc: 'Мэргэжлийн эмч нар' },
  { icon: <UsersGroupIcon />, title: '10,000+', desc: 'Сэтгэл ханамжтай хэрэглэгч' }
];

const HERO_AVATARS = [
  '/doctor-portraits/doctor-01.jpg',
  '/doctor-portraits/doctor-03.jpg',
  '/doctor-portraits/doctor-05.jpg',
  '/doctor-portraits/doctor-07.jpg'
];

const HERO_LINE_1 = ['Эмнэлгийн', 'цагаа', 'хэдхэн'];
const HERO_LINE_2 = ['товшилтоор', 'захиалаарай'];

function AnimatedWords({ words, startIndex = 0 }) {
  return words.map((word, i) => (
    <span
      key={word}
      className={styles.titleWord}
      style={{ animationDelay: `${(startIndex + i) * 90}ms, 0ms` }}
    >
      {word}{i < words.length - 1 ? ' ' : ''}
    </span>
  ));
}

const QUICK_LINKS = [
  {
    icon: 'M9 3v4a2 2 0 0 0 4 0V3 M7 3h1.5 M13.5 3H15 M11 11v2.2a4 4 0 0 0 8 0v-.7 M19.5 12a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z M5 21v-3.4A4.6 4.6 0 0 1 9.6 13H10',
    title: 'Эмч хайх',
    desc: 'Мэргэшсэн эмч нартайгаа холбогдоорой.'
  },
  {
    icon: 'M4 10.5h16M7 3.5v4M17 3.5v4M6.5 6.5h11A2.5 2.5 0 0 1 20 9v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V9a2.5 2.5 0 0 1 2.5-2.5Z',
    title: 'Цаг захиалах',
    desc: 'Хэдхэн товшилтоор цаг захиална.'
  },
  {
    icon: 'M7 4h7.5L19 8.5V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.8A1.8 1.8 0 0 1 7 4Z M14.3 4v4.7H19 M8.7 12.4h5.6 M8.7 15.5h3.3',
    title: 'Миний жор',
    desc: 'Бичигдсэн жороо шууд харна.'
  },
  {
    icon: 'M5 20V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8V20 M3.5 20h17 M9 8h6 M9 13.5h5',
    title: 'Тасаг харах',
    desc: 'Бүх тасаг, мэргэжлийг үзнэ.'
  },
  {
    icon: 'M4 11.5 12 5l8 6.5 M6.5 10.5V19h11v-8.5 M9.4 19v-4.8h5.2V19',
    title: 'Хяналтын самбар',
    desc: 'Захиалга, статистикаа нэг дороос харна.'
  }
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.menuIconSvg}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.menuIconSvg}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.checkIcon}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12.3 2.6 2.6L16.5 9" />
    </svg>
  );
}

const DEPARTMENTS = [
  { img: '/departments/dept-internal.jpg', title: 'Дотрын тасаг', desc: 'Ерөнхий үзлэг, дотоод өвчний оношилгоо.' },
  { img: '/departments/dept-cardiology.jpg', title: 'Зүрх судас', desc: 'Зүрх, судасны эрүүл мэндийн үзлэг.' },
  { img: '/departments/dept-surgery.jpg', title: 'Мэс заслын тасаг', desc: 'Мэс заслын өмнөх болон дараах тусламж.' },
  { img: '/departments/dept-eye.jpg', title: 'Нүдний тасаг', desc: 'Нүдний үзлэг, харааны шинжилгээ.' },
  { img: '/departments/dept-pediatrics.jpg', title: 'Хүүхдийн тасаг', desc: 'Хүүхдийн эрүүл мэндийн тусгай үзлэг.' }
];

const STATS = [
  {
    icon: 'M5 20V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8V20 M3.5 20h17 M9 8h6 M9 13.5h5',
    value: '5+',
    label: 'Тасаг'
  },
  {
    icon: 'M9 3v4a2 2 0 0 0 4 0V3 M7 3h1.5 M13.5 3H15 M11 11v2.2a4 4 0 0 0 8 0v-.7 M19.5 12a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z M5 21v-3.4A4.6 4.6 0 0 1 9.6 13H10',
    value: '10+',
    label: 'Мэргэжлийн эмч'
  },
  {
    icon: 'M4 13v-1a8 8 0 0 1 16 0v1 M3 13h4.2v6H3z M16.8 13H21v6h-4.2z M19.5 19.5v.6a2.9 2.9 0 0 1-2.9 2.9H14',
    value: '24/7',
    label: 'Онлайн үйлчилгээ'
  },
  {
    icon: 'M7 4h7.5L19 8.5V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.8A1.8 1.8 0 0 1 7 4Z M14.3 4v4.7H19 M8.7 12.4h5.6 M8.7 15.5h3.3',
    value: '100%',
    label: 'Цахим бүртгэл'
  }
];

const WHY_US = [
  'Цахим бүртгэл, хурдан үйлчилгээ',
  'Мэргэшсэн эмч нартай шууд холбогдох',
  'Хаана ч, хэдийд ч онлайнаар хандах',
  'Хувийн мэдээллийн нууцлал хамгаалагдсан',
  'Хэрэглэхэд хялбар, ойлгомжтой интерфейс'
];

const STEPS = [
  { n: '01', title: 'Бүртгүүлэх', desc: 'Имэйл эсвэл Google акаунтаараа хэдхэн секундэд бүртгүүлнэ.' },
  { n: '02', title: 'Эмч, цагаа сонгох', desc: 'Тасгаа сонгоод, чөлөөтэй эмч, боломжит цагаа захиална.' },
  { n: '03', title: 'Онлайн удирдах', desc: 'Захиалга, жор, үзлэгийн бичлэгээ нэг дороос хянана.' }
];

export default function Landing({ onGetStarted, onLogin, onLearnMore }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <header className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoMark /></div>
          <div>
            <div className={styles.navTitle}>МедСистем</div>
            <div className={styles.navSub}>Эмнэлгийн удирдлагын систем</div>
          </div>
        </div>

        <nav className={styles.navLinks}>
          <a href="#how-it-works">Хэрхэн ажилладаг</a>
          <a href="#departments">Тасгууд</a>
          <a href="#why-us">Бидний тухай</a>
        </nav>

        <div className={styles.navActions}>
          <button className={styles.navLoginBtn} onClick={onLogin}>Нэвтрэх</button>
          <button className={styles.navBtn} onClick={onGetStarted}>Бүртгүүлэх</button>
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          aria-label={menuOpen ? 'Цэс хаах' : 'Цэс нээх'}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="#how-it-works" onClick={closeMenu}>Хэрхэн ажилладаг</a>
          <a href="#departments" onClick={closeMenu}>Тасгууд</a>
          <a href="#why-us" onClick={closeMenu}>Бидний тухай</a>
          <div className={styles.mobileMenuActions}>
            <button className={styles.navLoginBtn} onClick={() => { closeMenu(); onLogin(); }}>Нэвтрэх</button>
            <button className={styles.navBtn} onClick={() => { closeMenu(); onGetStarted(); }}>Бүртгүүлэх</button>
          </div>
        </div>
      )}

      <main>
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <img src="/hero/hero-bg.jpg" alt="" className={styles.heroBgImg} />
            <div className={styles.heroBgScrim} />
          </div>

          <div className={`${styles.heroText} fade-up`}>
            <p className={styles.eyebrow}>ТАНЫ ЭРҮҮЛ МЭНД, БИДНИЙ ТЭРГҮҮН ЗОРИЛГО</p>
            <h1 className={styles.heroTitle}>
              <AnimatedWords words={HERO_LINE_1} />
              <br />
              <AnimatedWords words={HERO_LINE_2} startIndex={HERO_LINE_1.length} />
            </h1>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={onGetStarted}>
                Эхлэх — Бүртгүүлэх <ArrowRightIcon />
              </button>
              <button className={styles.secondaryBtn} onClick={onLogin}>
                <DoctorSearchIcon /> Надад бүртгэл бий
              </button>
            </div>
            <div className={styles.trustRow}>
              <div className={styles.avatarStack}>
                {HERO_AVATARS.map(src => (
                  <img key={src} src={src} alt="" className={styles.avatarStackItem} />
                ))}
              </div>
              <div className={styles.trustText}>
                <strong>10,000+</strong>
                <span>хэрэглэгч итгэдэг</span>
              </div>
            </div>
          </div>

          <div className={`${styles.heroVisual} fade-up`}>
            <div className={styles.miniCardCol}>
              {HERO_MINI_CARDS.map(card => (
                <div className={styles.miniCard} key={card.desc}>
                  <span className={styles.miniCardIcon}>{card.icon}</span>
                  <div>
                    <div className={styles.miniCardTitle}>{card.title}</div>
                    <div className={styles.miniCardDesc}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.quickHelp}>
          <div className={styles.helpCard}>
            <h2 className={styles.helpTitle}>Танд юугаар туслах вэ?</h2>
            <div className={styles.helpGrid}>
              {QUICK_LINKS.map(item => (
                <button
                  key={item.title}
                  type="button"
                  className={styles.helpItem}
                  onClick={onGetStarted}
                >
                  <span className={styles.helpIconWrap}><FeatureIcon d={item.icon} /></span>
                  <span className={styles.helpItemTitle}>{item.title}</span>
                  <span className={styles.helpItemDesc}>{item.desc}</span>
                  <span className={styles.helpArrow}>→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.steps}>
          <Reveal><h2 className={styles.sectionTitle}>Хэрхэн ажилладаг вэ?</h2></Reveal>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className={styles.stepCard}>
                  <div className={styles.stepNum}>{s.n}</div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="departments" className={styles.departments}>
          <Reveal><h2 className={styles.sectionTitle}>Манай тасгууд</h2></Reveal>
          <Reveal><p className={styles.sectionSub}>Танд тохирсон мэргэжлийн тасаг, эмчийг сонгоорой.</p></Reveal>
          <div className={styles.deptGrid}>
            {DEPARTMENTS.map((d, i) => (
              <Reveal key={d.title} delay={i * 60}>
                <button type="button" className={styles.deptCard} onClick={onGetStarted}>
                  <img src={d.img} alt={d.title} className={styles.deptImg} />
                  <div className={styles.deptBody}>
                    <div>
                      <div className={styles.deptTitle}>{d.title}</div>
                      <div className={styles.deptDesc}>{d.desc}</div>
                    </div>
                    <span className={styles.deptArrowBtn}><ArrowRightIcon /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal className={styles.deptViewAllWrap}>
            <button type="button" className={styles.secondaryBtn} onClick={onGetStarted}>
              Бүх тасгуудыг үзэх <ArrowRightIcon />
            </button>
          </Reveal>
        </section>

        <Reveal as="section" className={styles.statsBar}>
          {STATS.map(s => (
            <div className={styles.statItem} key={s.label}>
              <span className={styles.statIcon}><FeatureIcon d={s.icon} /></span>
              <div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </Reveal>

        <section id="why-us" className={styles.whyUs}>
          <Reveal className={styles.whyUsPhotoCol}>
            <div className={styles.whyUsPhotoFrame}>
              <img src="/hero/building.jpg" alt="МедСистем-ийн эмнэлгийн байр" className={styles.whyUsPhoto} />
              <div className={styles.missionCard}>
                <div className={styles.missionTitle}>Эрхэм зорилго</div>
                <p className={styles.missionText}>Эрүүл мэндийн үйлчилгээг чанартай, энэрэнгүй, инновацлаг байдлаар хүргэх.</p>
              </div>
            </div>
          </Reveal>

          <Reveal className={styles.whyUsTextCol}>
            <h2 className={styles.whyUsTitle}>Яагаад <span className={styles.whyUsAccent}>МедСистем</span>-ийг сонгох вэ?</h2>
            <p className={styles.whyUsDesc}>Инновац, мэргэжлийн ур чадвар, халамжийг нэгтгэн эрүүл мэндийн шилдэг үйлчилгээг үзүүлдэг.</p>
            <ul className={styles.whyUsList}>
              {WHY_US.map(item => (
                <li key={item}><CheckIcon /> {item}</li>
              ))}
            </ul>
            <button type="button" className={styles.secondaryBtn} onClick={onLearnMore}>
              Дэлгэрэнгүй үзэх <ArrowRightIcon />
            </button>
          </Reveal>

          <Reveal className={styles.emergencyCol}>
            <div className={styles.emergencyCard}>
              <div className={styles.emergencyIconWrap}><HeadsetIcon /></div>
              <div className={styles.emergencyTitle}>Яаралтай тусламж хэрэгтэй юу?</div>
              <p className={styles.emergencyText}>Бид 24/7 онлайн бэлэн байдаг. Таны эрүүл мэнд бидний тэргүүн зорилго.</p>
              <a href="tel:+97670112233" className={styles.emergencyPhone}>
                <span className={styles.emergencyPhoneIcon}>☎</span> 7011-2233
              </a>
            </div>
          </Reveal>
        </section>

        <Reveal as="section" className={styles.bookBanner}>
          <div className={styles.banIconWrap}><CalendarPlusIcon /></div>
          <div className={styles.banText}>
            <div className={styles.banTitle}>Таны эрүүл мэнд бидний тэргүүн зорилго</div>
            <div className={styles.banDesc}>Та болон таны гэр бүлийн эрүүл мэндийг найдвартай үйлчилгээгээр хамгаалъя.</div>
          </div>
          <button type="button" className={styles.banBtn} onClick={onGetStarted}>
            Одоо цаг захиалах <ArrowRightIcon />
          </button>
          <span className={styles.banBadge}><PersonPlusIcon /></span>
        </Reveal>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerCol}>
            <div className={styles.navLogo}>
              <div className={styles.logoIcon}><LogoMark /></div>
              <div className={styles.navTitle}>МедСистем</div>
            </div>
            <p className={styles.footerDesc}>Эмнэлгийн удирдлагын систем — цаг захиалга, жор, үзлэгийн бичлэгийг нэг дороос.</p>
          </div>

          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Түргэн холбоос</div>
            <a href="#how-it-works" className={styles.footerLink}>Хэрхэн ажилладаг</a>
            <a href="#departments" className={styles.footerLink}>Тасгууд</a>
            <a href="#why-us" className={styles.footerLink}>Бидний тухай</a>
            <button type="button" className={styles.footerLinkBtn} onClick={onLearnMore}>Дэлгэрэнгүй</button>
          </div>

          <div className={styles.footerCol}>
            <div className={styles.footerHeading}>Холбоо барих</div>
            <div className={styles.footerContactItem}>
              <span className={styles.footerContactIcon}><PinIcon /></span>
              <span className={styles.footerItem}>Энхтайвны өргөн чөлөө, Шангри-Ла молл 1010</span>
            </div>
            <div className={styles.footerContactItem}>
              <span className={styles.footerContactIcon}><PhoneIcon /></span>
              <a href="tel:+97670112233" className={styles.footerItem}>7011-2233</a>
            </div>
            <div className={styles.footerContactItem}>
              <span className={styles.footerContactIcon}><MailIcon /></span>
              <a href="mailto:Suld@hospital.mn" className={styles.footerItem}>Suld@hospital.mn</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} МедСистем. Бүх эрх хуулиар хамгаалагдсан.</span>
        </div>
      </footer>
    </div>
  );
}
