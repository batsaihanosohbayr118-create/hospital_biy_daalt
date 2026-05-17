import { Children, isValidElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './UI.module.css';

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className={styles.pageHeader}>
      <div style={{ flex: 1 }}>
        <h2 className={styles.pageTitle}>{title}</h2>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function SearchBar({ children, className = '' }) {
  return <div className={`${styles.searchBar} ${className}`}>{children}</div>;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function SearchInput({ className = '', ...props }) {
  return (
    <div className={`${styles.searchWrap} ${className}`}>
      <SearchIcon />
      <input className={styles.searchInput} type="text" {...props} />
    </div>
  );
}

export function Btn({ variant = 'primary', size = 'md', className = '', ...props }) {
  const v = variant === 'outline' ? styles.btnOutline : variant === 'danger' ? styles.btnDanger : styles.btn;
  const s = size === 'sm' ? styles.btnSm : '';
  return <button className={`${styles.btnBase} ${v} ${s} ${className}`} {...props} />;
}

export function TableCard({ children, className = '' }) {
  return <div className={`${styles.tableCard} ${className}`}>{children}</div>;
}

export function TableHeader({ title, right }) {
  return (
    <div className={styles.tableHeader}>
      <h3>{title}</h3>
      {right}
    </div>
  );
}

export function EmptyRow({ cols, msg = 'No data' }) {
  return (
    <tr>
      <td colSpan={cols} className={styles.emptyRow}>{msg}</td>
    </tr>
  );
}

export function LoadingRow({ cols }) {
  return (
    <tr>
      <td colSpan={cols} className={styles.loadingRow}>
        <span className="spinner" />
      </td>
    </tr>
  );
}

export function Field({ label, children }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
    </div>
  );
}

export function Input(props) {
  return <input className={styles.input} {...props} />;
}

function EyeIcon({ off = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

export function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`${styles.passwordWrap} ${className}`}>
      <input
        className={styles.passwordInput}
        type={visible ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Нууц үг нуух' : 'Нууц үг харах'}
        title={visible ? 'Нуух' : 'Харах'}
      >
        <EyeIcon off={visible} />
      </button>
    </div>
  );
}

export function Select({ className = '', value = '', onChange, children, disabled = false, ...props }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const options = useMemo(() => (
    Children.toArray(children)
      .filter(isValidElement)
      .map(child => ({
        value: child.props.value ?? '',
        label: child.props.children,
        disabled: !!child.props.disabled
      }))
  ), [children]);
  const selected = options.find(opt => String(opt.value) === String(value)) || options[0];

  useEffect(() => {
    const close = e => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) return;

    const positionMenu = () => {
      const rect = wrapRef.current.getBoundingClientRect();
      const gap = 6;
      const viewportPadding = 10;
      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
      const spaceAbove = rect.top - viewportPadding;
      const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(120, Math.min(260, openUp ? spaceAbove - gap : spaceBelow - gap));

      setMenuStyle({
        position: 'fixed',
        left: `${rect.left}px`,
        top: openUp ? 'auto' : `${rect.bottom + gap}px`,
        bottom: openUp ? `${window.innerHeight - rect.top + gap}px` : 'auto',
        width: `${rect.width}px`,
        maxHeight: `${maxHeight}px`
      });
    };

    positionMenu();
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    return () => {
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu, true);
    };
  }, [open]);

  const choose = opt => {
    if (opt.disabled) return;
    onChange?.({ target: { value: opt.value } });
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={styles.selectWrap} {...props}>
      <button
        type="button"
        className={`${styles.select} ${styles.selectButton} ${open ? styles.selectOpen : ''} ${className}`}
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
      >
        <span className={styles.selectText}>{selected?.label || 'Сонгох'}</span>
        <span className={styles.selectChevron} aria-hidden="true" />
      </button>
      {open && !disabled && createPortal(
        <div ref={menuRef} className={styles.selectMenu} style={menuStyle || undefined}>
          {options.map(opt => (
            <button
              key={String(opt.value)}
              type="button"
              className={`${styles.selectOption} ${String(opt.value) === String(value) ? styles.selectOptionActive : ''}`}
              disabled={opt.disabled}
              onClick={() => choose(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export function FormGrid({ children, style, className = '' }) {
  return <div className={`${styles.formGrid} ${className}`} style={style}>{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className={styles.modalFooter}>{children}</div>;
}
