import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import { PageHeader, TableCard } from '../components/UI';
import styles from './Departments.module.css';

const DepartmentIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 20V6.8A2.8 2.8 0 0 1 7.8 4h8.4A2.8 2.8 0 0 1 19 6.8V20" />
    <path d="M3.5 20h17" />
    <path d="M9 8h6" />
    <path d="M12 11v5" />
    <path d="M9.5 13.5h5" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 14h10l1-14" />
    <path d="M9 7V4h6v3" />
  </svg>
);

const ToothIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.2 3.6c1.4 0 2.1.8 3.8.8s2.4-.8 3.8-.8c2.5 0 4 2.2 3.3 5.4l-1.6 7.2c-.5 2.3-1.8 4.2-3.3 4.2-1.2 0-1.1-3.9-2.2-3.9s-1 3.9-2.2 3.9c-1.5 0-2.8-1.9-3.3-4.2L4.9 9c-.7-3.2.8-5.4 3.3-5.4Z" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20s-7.5-4.5-8.8-10.1C2.5 6.7 4.5 4 7.5 4c1.8 0 3.1 1 4.5 2.5C13.4 5 14.7 4 16.5 4c3 0 5 2.7 4.3 5.9C19.5 15.5 12 20 12 20Z" />
    <path d="M7 12h2.5l1.1-2.4 2.1 5 1.3-2.6h3" />
  </svg>
);

const ChildIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="7.5" r="3.2" />
    <path d="M6 20a6 6 0 0 1 12 0" />
    <path d="M8.4 12.8 6.5 15" />
    <path d="M15.6 12.8 17.5 15" />
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.5 18.7A3.6 3.6 0 0 1 5 15.1a3.4 3.4 0 0 1 .9-2.4A3.7 3.7 0 0 1 8 6a4 4 0 0 1 7.7-1.2 3.9 3.9 0 0 1 2.4 6.7 3.7 3.7 0 0 1-2.6 6.4" />
    <path d="M12 5.3v14" />
    <path d="M8.2 10.2c1.2 0 2-.6 2.6-1.6" />
    <path d="M15.8 10.2c-1.2 0-2-.6-2.6-1.6" />
    <path d="M8.6 14.8c1.3.2 2.3-.2 3.4-1.1" />
    <path d="M15.4 14.8c-1.3.2-2.3-.2-3.4-1.1" />
  </svg>
);

const SurgeryIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 19 7.8-7.8" />
    <path d="m9 5 10 10" />
    <path d="m14.5 10.5 2.7-2.7a2 2 0 0 1 2.8 2.8l-2.7 2.7" />
    <path d="M4 20h6" />
  </svg>
);

const WomenIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="4.2" />
    <path d="M12 12.2V21" />
    <path d="M8.5 17.2h7" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EntIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 9a5 5 0 0 1 10 0c0 3.2-2.4 3.7-2.4 6.2A2.6 2.6 0 0 1 12 18" />
    <path d="M9.2 9a2.8 2.8 0 0 1 5.6 0" />
    <path d="M5 19h14" />
  </svg>
);

const EmergencyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 2.8 19h18.4L12 3Z" />
    <path d="M12 9v4.5" />
    <path d="M12 17h.01" />
  </svg>
);

const DoctorIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="7" r="3.2" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M9 13.2 12 17l3-3.8" />
  </svg>
);

const InternalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.8 4.5c-1.9 2.1-2.8 4.6-2.8 7.4 0 3.9 2.2 7.1 5.2 7.1" />
    <path d="M15.2 4.5c1.9 2.1 2.8 4.6 2.8 7.4 0 3.9-2.2 7.1-5.2 7.1" />
    <path d="M9.5 10.5h5" />
    <path d="M12 8v5" />
  </svg>
);

const getDepartmentIcon = dep => {
  if (dep.includes('Шүд')) return <ToothIcon />;
  if (dep.includes('Зүрх')) return <HeartIcon />;
  if (dep.includes('Хүүхэд')) return <ChildIcon />;
  if (dep.includes('Мэдрэл') || dep.includes('Сэтгэц') || dep.includes('Сэтгэл')) return <BrainIcon />;
  if (dep.includes('Мэс')) return <SurgeryIcon />;
  if (dep.includes('Эмэгтэй')) return <WomenIcon />;
  if (dep.includes('Нүд')) return <EyeIcon />;
  if (dep.includes('Чих') || dep.includes('хамар') || dep.includes('хоолой')) return <EntIcon />;
  if (dep.includes('Яаралтай')) return <EmergencyIcon />;
  if (dep.includes('Дотор')) return <InternalIcon />;
  return <DepartmentIcon />;
};

export default function Departments() {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('az');
  const [sortOpen, setSortOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [editingName, setEditingName] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState('');
  const [saving, setSaving] = useState(false);
  const isAdmin = user?.role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [depRes, doctorRes] = await Promise.all([
        api.get('/departments'),
        api.get('/doctors')
      ]);
      setDepartments(depRes.data.departments || []);
      setDoctors(doctorRes.data.doctors || []);
    } catch {
      setDepartments([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const doctorCounts = useMemo(() => {
    return doctors.reduce((acc, doctor) => {
      if (!doctor.specialization) return acc;
      acc[doctor.specialization] = (acc[doctor.specialization] || 0) + 1;
      return acc;
    }, {});
  }, [doctors]);

  const selectedDoctors = useMemo(() => {
    return doctors.filter(doctor => doctor.specialization === selectedDepartment);
  }, [doctors, selectedDepartment]);

  const filteredDepartments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return departments
      .filter(dep => {
        if (needle && !dep.toLowerCase().includes(needle)) return false;
        if (filter === 'withDoctors') return (doctorCounts[dep] || 0) > 0;
        if (filter === 'empty') return (doctorCounts[dep] || 0) === 0;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'za') return b.localeCompare(a, 'mn');
        if (sort === 'doctors') return (doctorCounts[b] || 0) - (doctorCounts[a] || 0) || a.localeCompare(b, 'mn');
        return a.localeCompare(b, 'mn');
      });
  }, [departments, query, filter, sort, doctorCounts]);

  const sortOptions = [
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
    { value: 'doctors', label: 'Эмчийн тоо' }
  ];
  const sortLabel = sortOptions.find(option => option.value === sort)?.label || 'A-Z';

  const createDepartment = async () => {
    const name = draftName.trim();
    if (!name) return toast('Тасгийн нэр оруулна уу.', 'error');
    setSaving(true);
    try {
      await api.post('/departments', { name });
      setDraftName('');
      toast('Тасаг нэмэгдлээ.');
      load();
    } catch (e) {
      toast(e.response?.data?.error || 'Тасаг нэмэхэд алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveDepartment = async () => {
    const nextName = editingValue.trim();
    if (!editingName || !nextName) return toast('Тасгийн нэр оруулна уу.', 'error');
    setSaving(true);
    try {
      await api.put(`/departments/${encodeURIComponent(editingName)}`, { name: nextName });
      setEditingName('');
      setEditingValue('');
      setSelectedDepartment(current => current === editingName ? nextName : current);
      toast('Тасаг шинэчлэгдлээ.');
      load();
    } catch (e) {
      toast(e.response?.data?.error || 'Тасаг засахад алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeDepartment = async dep => {
    setSaving(true);
    try {
      await api.delete(`/departments/${encodeURIComponent(dep)}`);
      setSelectedDepartment(current => current === dep ? '' : current);
      setDeleteTarget('');
      toast('Тасаг устгагдлаа.');
      load();
    } catch (e) {
      toast(e.response?.data?.error || 'Тасаг устгахад алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade-up">
      <PageHeader title="Тасаг" subtitle="Эмнэлгийн тасгууд болон эмчийн тоо" />

      <TableCard>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedDepartment('');
              }}
              placeholder="Тасаг хайх"
              aria-label="Тасаг хайх"
            />
          </div>

          <div className={styles.controls}>
            <button type="button" className={filter === 'all' ? styles.controlActive : ''} onClick={() => setFilter('all')}>Бүгд</button>
            <button type="button" className={filter === 'withDoctors' ? styles.controlActive : ''} onClick={() => setFilter('withDoctors')}>Эмчтэй</button>
            <button type="button" className={filter === 'empty' ? styles.controlActive : ''} onClick={() => setFilter('empty')}>Эмчгүй</button>
            <div className={styles.sortSelect}>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => setSortOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <span>{sortLabel}</span>
                <span className={`${styles.sortChevron} ${sortOpen ? styles.sortChevronOpen : ''}`} aria-hidden="true">⌄</span>
              </button>
              {sortOpen && (
                <div className={styles.sortMenu} role="listbox" aria-label="Эрэмбэлэх">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={sort === option.value}
                      className={`${styles.sortOption} ${sort === option.value ? styles.sortOptionActive : ''}`}
                      onClick={() => {
                        setSort(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className={styles.adminBar}>
            <input
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              placeholder="Шинэ тасгийн нэр"
              onKeyDown={e => e.key === 'Enter' && createDepartment()}
            />
            <button type="button" onClick={createDepartment} disabled={saving}>+ Нэмэх</button>
          </div>
        )}

        {loading ? (
          <div className={styles.state}>Ачаалж байна...</div>
        ) : departments.length === 0 ? (
          <div className={styles.state}>Тасаг олдсонгүй.</div>
        ) : filteredDepartments.length === 0 ? (
          <div className={styles.state}>Хайлтад тохирох тасаг олдсонгүй.</div>
        ) : (
          <div className={styles.grid}>
            {filteredDepartments.map(dep => (
              <div
                key={dep}
                role="button"
                tabIndex={0}
                className={`${styles.card} ${selectedDepartment === dep ? styles.cardActive : ''}`}
                onClick={() => setSelectedDepartment(current => current === dep ? '' : dep)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDepartment(current => current === dep ? '' : dep);
                  }
                }}
              >
                <div className={styles.iconWrap}>
                  {getDepartmentIcon(dep)}
                </div>
                <div className={styles.cardBody}>
                  {editingName === dep ? (
                    <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                      <input value={editingValue} onChange={e => setEditingValue(e.target.value)} />
                      <button type="button" onClick={saveDepartment} disabled={saving}>OK</button>
                    </div>
                  ) : (
                    <>
                      <h3>{dep}</h3>
                      <p>{doctorCounts[dep] || 0} эмч</p>
                    </>
                  )}
                </div>
                {isAdmin && editingName !== dep && (
                  <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    <button type="button" className={styles.editAction} aria-label="Засах" title="Засах" onClick={() => { setEditingName(dep); setEditingValue(dep); }}>
                      <EditIcon />
                    </button>
                    <button type="button" className={styles.deleteAction} aria-label="Устгах" title="Устгах" onClick={() => setDeleteTarget(dep)} disabled={saving || (doctorCounts[dep] || 0) > 0}>
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </TableCard>

      {selectedDepartment && (
        <TableCard className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <div>
              <h3>{selectedDepartment}</h3>
              <p>{selectedDoctors.length} эмч бүртгэлтэй</p>
            </div>
            <button type="button" className={styles.closeBtn} onClick={() => setSelectedDepartment('')}>
              Хаах
            </button>
          </div>

          {selectedDoctors.length === 0 ? (
            <div className={styles.state}>Энэ тасагт эмч бүртгэлгүй байна.</div>
          ) : (
            <div className={styles.doctorGrid}>
              {selectedDoctors.map(doctor => (
                <div key={doctor.id} className={styles.doctorCard}>
                  {doctor.profile_image_url ? (
                    <img src={doctor.profile_image_url} alt={`${doctor.first_name} ${doctor.last_name}`} className={styles.doctorPhoto} />
                  ) : (
                    <div className={styles.doctorAvatar}><DoctorIcon /></div>
                  )}
                  <div className={styles.doctorInfo}>
                    <h4>{doctor.first_name} {doctor.last_name}</h4>
                    <p>{doctor.position_title || 'Эмч'}</p>
                    <div className={styles.doctorMeta}>
                      <span>Өрөө: {doctor.room_number || '—'}</span>
                      <span>{doctor.experience_years ? `${doctor.experience_years} жил` : 'Туршлага —'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TableCard>
      )}

      {deleteTarget && (
        <div className={styles.confirmOverlay} role="presentation" onClick={() => !saving && setDeleteTarget('')}>
          <div className={styles.confirmDialog} role="dialog" aria-modal="true" aria-labelledby="delete-department-title" onClick={e => e.stopPropagation()}>
            <div className={styles.confirmIcon}>
              <TrashIcon />
            </div>
            <div>
              <h3 id="delete-department-title">Тасаг устгах уу?</h3>
              <p>“{deleteTarget}” тасгийг устгасны дараа буцаах боломжгүй.</p>
            </div>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDeleteTarget('')} disabled={saving}>Болих</button>
              <button type="button" className={styles.deleteBtn} onClick={() => removeDepartment(deleteTarget)} disabled={saving}>Устгах</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
