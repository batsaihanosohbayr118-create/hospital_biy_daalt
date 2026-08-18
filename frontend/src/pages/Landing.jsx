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

const FEATURES = [
  {
    icon: 'M4 10.5h16M7 3.5v4M17 3.5v4M6.5 6.5h11A2.5 2.5 0 0 1 20 9v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V9a2.5 2.5 0 0 1 2.5-2.5Z',
    title: 'Онлайн цаг захиалга',
    desc: 'Тасаг, эмчээ сонгоод чөлөөтэй цагаа хэдхэн товшилтоор захиалаарай.'
  },
  {
    icon: 'M7 4h7.5L19 8.5V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.8A1.8 1.8 0 0 1 7 4Z M14.3 4v4.7H19 M8.7 12.4h5.6 M8.7 15.5h3.3',
    title: 'Дижитал жор',
    desc: 'Эмчийн бичсэн жороо шууд харж, PDF хэлбэрээр хэвлэн авах боломжтой.'
  },
  {
    icon: 'M9 3v4a2 2 0 0 0 4 0V3 M7 3h1.5 M13.5 3H15 M11 11v2.2a4 4 0 0 0 8 0v-.7 M19.5 12a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z M5 21v-3.4A4.6 4.6 0 0 1 9.6 13H10',
    title: 'Мэргэжлийн эмч нар',
    desc: 'Тасаг тус бүрээр ангилсан, туршлагатай эмч нарын мэдээллийг харах.'
  },
  {
    icon: 'M5 20V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8V20 M3.5 20h17 M9 8h6 M9 13.5h5',
    title: 'Тасгаар удирдах',
    desc: 'Эмнэлгийн тасаг, өрөө, ажлын хуваарийг нэг дороос удирдах.'
  },
  {
    icon: 'M12 3 5 6.2v5.4C5 16.2 8 19.8 12 21c4-1.2 7-4.8 7-9.4V6.2L12 3Z M9.3 12.1l1.9 1.9 3.6-3.9',
    title: 'Аюулгүй нэвтрэлт',
    desc: 'JWT болон Google OAuth ашигласан найдвартай, аюулгүй нэвтрэх систем.'
  },
  {
    icon: 'M4 11.5 12 5l8 6.5 M6.5 10.5V19h11v-8.5 M9.4 19v-4.8h5.2V19',
    title: 'Хяналтын самбар',
    desc: 'Админ, эмч, өвчтөн тус бүрдээ зориулсан статистик, хяналтын самбартай.'
  }
];

const HERO_LINE_1 = ['Эмнэлгийн', 'цагаа'];
const HERO_LINE_2 = ['хэдхэн', 'товшилтоор', 'захиалаарай'];

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

const STEPS = [
  { n: '01', title: 'Бүртгүүлэх', desc: 'Имэйл эсвэл Google акаунтаараа хэдхэн секундэд бүртгүүлнэ.' },
  { n: '02', title: 'Эмч, цагаа сонгох', desc: 'Тасгаа сонгоод, чөлөөтэй эмч, боломжит цагаа захиална.' },
  { n: '03', title: 'Онлайн удирдах', desc: 'Захиалга, жор, үзлэгийн бичлэгээ нэг дороос хянана.' }
];

export default function Landing({ onGetStarted, onLogin }) {
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
        <button className={styles.navBtn} onClick={onLogin}>Нэвтрэх</button>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={`${styles.heroText} fade-up`}>
            <h1 className={styles.heroTitle}>
              <AnimatedWords words={HERO_LINE_1} />
              <br />
              <AnimatedWords words={HERO_LINE_2} startIndex={HERO_LINE_1.length} />
            </h1>
            <p className={styles.heroDesc}>
              МедСистем нь өвчтөн, эмч, админ гурвыг нэг дороос холбож, цаг захиалга,
              эмчийн бичлэг, жор бичих зэрэг үйл ажиллагааг онлайнаар хялбар, хурдан болгодог.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={onGetStarted}>Эхлэх — Бүртгүүлэх</button>
              <button className={styles.secondaryBtn} onClick={onLogin}>Надад бүртгэл бий</button>
            </div>
          </div>

          <div className={`${styles.heroVisual} fade-up`}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardRow}>
                <span className={styles.heroCardDot} />
                <span>Цаг захиалга баталгаажлаа</span>
              </div>
              <div className={styles.heroStat}>
                <div>
                  <div className={styles.heroStatLabel}>Тасаг</div>
                  <div className={styles.heroStatValue}>Зүрх судас</div>
                </div>
                <div>
                  <div className={styles.heroStatLabel}>Өрөө</div>
                  <div className={styles.heroStatValue}>102</div>
                </div>
              </div>
              <div className={styles.heroCardFooter}>Онлайнаар хэдхэн товшилтоор</div>
            </div>
            <div className={styles.heroCardGhost} />
          </div>
        </section>

        <section className={styles.features}>
          <Reveal><h2 className={styles.sectionTitle}>Систем юу санал болгодог вэ?</h2></Reveal>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70} className={styles.featureGridItem}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrap}><FeatureIcon d={f.icon} /></div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.steps}>
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

        <section className={styles.cta}>
          <Reveal>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Одоо эхлэхэд бэлэн үү?</h2>
              <p className={styles.ctaDesc}>Хэдхэн секундэд бүртгүүлээд, эмнэлгийн үйлчилгээгээ онлайнаар удирдаж эхлээрэй.</p>
              <button className={styles.primaryBtn} onClick={onGetStarted}>Үнэгүй бүртгүүлэх</button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerCol}>
          <div className={styles.navLogo}>
            <div className={styles.logoIcon}><LogoMark /></div>
            <div className={styles.navTitle}>МедСистем</div>
          </div>
          <p className={styles.footerDesc}>Эмнэлгийн удирдлагын систем.</p>
        </div>
        <div className={styles.footerCol}>
          <div className={styles.footerHeading}>Холбоо барих</div>
          <div className={styles.footerItem}><span className={styles.footerLabel}>Хаяг:</span> Энхтайвны өргөн чөлөө, Шангри-Ла молл 1010</div>
          <div className={styles.footerItem}><span className={styles.footerLabel}>Утас:</span> 7011-2233</div>
          <div className={styles.footerItem}><span className={styles.footerLabel}>Имэйл:</span> Suld@hospital.mn</div>
        </div>
      </footer>
    </div>
  );
}
