import { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';

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
        <linearGradient id="aboutLogoGrad" x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f6bff" />
          <stop offset="1" stopColor="#00b3a4" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="38" height="38" rx="13" fill="url(#aboutLogoGrad)" />
      <path d="M21 13h6v8h8v6h-8v8h-6v-8h-8v-6h8z" fill="#fff" />
      <path d="M12 35h6l2.5-5 4.5 8 3.5-6H36" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".92" />
      <circle cx="36.5" cy="12.5" r="3.5" fill="#dffcf8" opacity=".9" />
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIconSvg}>
      <path d="M12 21.5c4-4 7-7.7 7-11.5a7 7 0 1 0-14 0c0 3.8 3 7.5 7 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIconSvg}>
      <path d="M5 4.5h3.2l1.3 4.4-2.1 1.7a13 13 0 0 0 5.9 5.9l1.7-2.1 4.4 1.3V19a1.7 1.7 0 0 1-1.8 1.7A15.3 15.3 0 0 1 3.3 6.3 1.7 1.7 0 0 1 5 4.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.contactIconSvg}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.4" />
      <path d="m4.5 7 7.5 6 7.5-6" />
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

const STATS = [
  { value: '5+', label: 'Тасаг' },
  { value: '10+', label: 'Мэргэжлийн эмч' },
  { value: '24/7', label: 'Онлайн үйлчилгээ' },
  { value: '100%', label: 'Цахим бүртгэл' }
];

const VALUES = [
  {
    title: 'Чанар',
    desc: 'Эрүүл мэндийн үйлчилгээг олон улсын жишигт нийцүүлэн, чанартай хүргэхийг эрхэмлэдэг.'
  },
  {
    title: 'Хүртээмж',
    desc: 'Хаана ч, хэдийд ч онлайнаар цаг захиалж, эмчтэйгээ холбогдох боломжийг олгодог.'
  },
  {
    title: 'Нууцлал',
    desc: 'Таны эрүүл мэнд, хувийн мэдээллийг найдвартай хамгаалахыг тэргүүн зорилгоо болгодог.'
  },
  {
    title: 'Инноваци',
    desc: 'Дижитал технологи ашиглан эмчилгээ, үйлчилгээний хүртээмжийг тасралтгүй сайжруулдаг.'
  }
];

const WHY_US = [
  'Цахим бүртгэл, хурдан үйлчилгээ',
  'Мэргэшсэн эмч нартай шууд холбогдох',
  'Хаана ч, хэдийд ч онлайнаар хандах',
  'Хувийн мэдээллийн нууцлал хамгаалагдсан',
  'Хэрэглэхэд хялбар, ойлгомжтой интерфейс'
];

export default function About({ onBack, onLogin, onGetStarted }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <div className={styles.navActions}>
          <button className={styles.backLink} onClick={onBack}>← Нүүр хуудас</button>
          <button className={styles.navLoginBtn} onClick={onLogin}>Нэвтрэх</button>
          <button className={styles.navBtn} onClick={onGetStarted}>Бүртгүүлэх</button>
        </div>
      </header>

      <main>
        <section className={`${styles.hero} fade-up`}>
          <p className={styles.eyebrow}>МЕДСИСТЕМИЙН ТУХАЙ</p>
          <h1 className={styles.heroTitle}>Эрүүл мэндийн үйлчилгээг цахимаар, ойр байлгах</h1>
          <p className={styles.heroDesc}>
            МедСистем нь өвчтөн, эмч, админ гурвыг нэг платформ дээр холбож, цаг захиалга,
            үзлэгийн бичлэг, жор бичих зэрэг эмнэлгийн өдөр тутмын үйл ажиллагааг
            хялбар, хурдан, найдвартай болгох зорилготой цахим систем юм.
          </p>
        </section>

        <Reveal as="section" className={styles.statsBar}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </Reveal>
          ))}
        </Reveal>

        <section className={styles.mission}>
          <Reveal>
            <div className={styles.missionCard}>
              <h2 className={styles.missionTitle}>Эрхэм зорилго</h2>
              <p className={styles.missionText}>
                Эрүүл мэндийн үйлчилгээг чанартай, энэрэнгүй, инновацлаг байдлаар хүргэх,
                өвчтөн бүрд хамгийн ойр, хамгийн хүртээмжтэй тусламжийг цахимаар хүргэх.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className={styles.visionCard}>
              <h2 className={styles.missionTitle}>Алсын хараа</h2>
              <p className={styles.missionText}>
                Монгол дахь эмнэлгийн үйлчилгээг бүрэн цахимжуулж, өвчтөн бүр өөрийн
                эмчтэйгээ хаанаас ч, хэзээ ч холбогдож чадах орчинг бий болгох.
              </p>
            </div>
          </Reveal>
        </section>

        <section className={styles.values}>
          <Reveal><h2 className={styles.sectionTitle}>Бидний үнэт зүйлс</h2></Reveal>
          <div className={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className={styles.valueCard}>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.whySection}>
          <Reveal><h2 className={styles.sectionTitle}>Яагаад МедСистем-ийг сонгох вэ?</h2></Reveal>
          <ul className={styles.whyList}>
            {WHY_US.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 70}><CheckIcon /> {item}</Reveal>
            ))}
          </ul>
        </section>

        <section className={styles.contact}>
          <Reveal><h2 className={styles.sectionTitle}>Холбоо барих</h2></Reveal>
          <div className={styles.contactGrid}>
            <Reveal>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}><PinIcon /></span>
                <div>
                  <div className={styles.contactLabel}>Хаяг</div>
                  <div className={styles.contactValue}>Энхтайвны өргөн чөлөө, Шангри-Ла молл 1010</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}><PhoneIcon /></span>
                <div>
                  <div className={styles.contactLabel}>Утас</div>
                  <div className={styles.contactValue}>7011-2233</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}><MailIcon /></span>
                <div>
                  <div className={styles.contactLabel}>Имэйл</div>
                  <div className={styles.contactValue}>Suld@hospital.mn</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <Reveal>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Өнөөдөр эхлээрэй</h2>
              <p className={styles.ctaDesc}>Хэдхэн секундэд бүртгүүлээд, эмнэлгийн үйлчилгээгээ онлайнаар удирдаж эхлээрэй.</p>
              <button className={styles.primaryBtn} onClick={onGetStarted}>
                Үнэгүй бүртгүүлэх <ArrowRightIcon />
              </button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoMark /></div>
          <div className={styles.navTitle}>МедСистем</div>
        </div>
        <p className={styles.footerDesc}>Эмнэлгийн удирдлагын систем.</p>
      </footer>
    </div>
  );
}
