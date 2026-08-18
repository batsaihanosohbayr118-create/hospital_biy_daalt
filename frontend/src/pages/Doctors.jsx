import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { PageHeader, SearchBar, SearchInput, Btn, TableCard, EmptyRow, LoadingRow, Field, Input, PasswordInput, Select, FormGrid, ModalFooter } from '../components/UI';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';
import { getDoctorPhoto, withDoctorPhoto } from '../utils/doctorPhotos';
import styles from './Table.module.css';

const EditIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 20h4.2L18.9 9.3a2.1 2.1 0 0 0 0-3l-1.2-1.2a2.1 2.1 0 0 0-3 0L4 15.8V20Z" />
    <path d="m13.8 6.2 4 4" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M9 7V4h6v3" />
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="7.5" cy="14.5" r="3.5" />
    <path d="M10.2 11.8 20 2" />
    <path d="m15.5 6.5 2 2" />
    <path d="m13.5 8.5 2 2" />
  </svg>
);

export default function Doctors() {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pwdModal, setPwdModal] = useState(false);
  const [pwdDoctor, setPwdDoctor] = useState(null);
  const [deleteDoctor, setDeleteDoctor] = useState(null);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [pwdValue, setPwdValue] = useState('');
  const [autoPassword, setAutoPassword] = useState(true);
  const [form, setForm] = useState({ first_name: '', last_name: '', specialization: '', phone: '', available_days: '', profile_image_url: '', experience_years: '', room_number: '', position_title: '', email: '', password: '' });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors');
      const doctors = (data.doctors || []).map(withDoctorPhoto);
      setAll(doctors); setFiltered(doctors);
    } catch { toast('Мэдээлэл ачаалахад алдаа гарлаа.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const loadDepartments = useCallback(async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data.departments || []);
    } catch {
      setDepartments([]);
    }
  }, []);

  useEffect(() => { if (isAdmin) loadDepartments(); }, [isAdmin, loadDepartments]);

  const filter = e => {
    const normalize = (s) => {
      const map = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j','з':'z','и':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','ө':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ү':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sh','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
        'ö':'o','ü':'u'
      };
      return (s || '')
        .toLowerCase()
        .replace(/[өүёа-яöü]/g, ch => map[ch] ?? ch)
        .replace(/[^a-z0-9]/g, '');
    };
    const q = normalize(e.target.value);
    setFiltered(all.filter(d => {
      if (!q) return true;
      const first = normalize(d.first_name);
      const last = normalize(d.last_name);
      return first.startsWith(q) || last.startsWith(q);
    }));
  };

  const submit = async () => {
    try {
      if (editingId) {
        const payload = { ...form, experience_years: form.experience_years ? +form.experience_years : null };
        delete payload.password;
        await api.put(`/doctors/${editingId}`, payload);
        toast('Эмчийн мэдээлэл шинэчлэгдлээ!');
      } else {
        const payload = { ...form, experience_years: form.experience_years ? +form.experience_years : null };
        if (autoPassword) delete payload.password;
        const { data } = await api.post('/doctors', payload);
        toast('Эмч амжилттай нэмэгдлээ!');
        setCreatedCredentials(data?.credentials || {
          email: form.email,
          username: data?.username || '',
          password: data?.tempPassword || form.password
        });
      }
      setModal(false);
      setEditingId(null);
      setForm({ first_name: '', last_name: '', specialization: '', phone: '', available_days: '', profile_image_url: '', experience_years: '', room_number: '', position_title: '', email: '', password: '' });
      setAutoPassword(true);
      load();
    } catch (e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({
      first_name: d.first_name || '',
      last_name: d.last_name || '',
      specialization: d.specialization || '',
      phone: d.phone || '',
      available_days: d.available_days || '',
      profile_image_url: d.profile_image_url || '',
      experience_years: d.experience_years ?? '',
      room_number: d.room_number ?? '',
      position_title: d.position_title ?? '',
      email: d.email || '',
      password: ''
    });
    setModal(true);
  };

  const remove = async () => {
    if (!deleteDoctor?.id) return;
    try {
      await api.delete(`/doctors/${deleteDoctor.id}`);
      toast('Эмч устгагдлаа.');
      setDeleteDoctor(null);
      load();
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    }
  };

  const openPwd = (d) => {
    setPwdDoctor(d);
    setPwdValue('');
    setPwdModal(true);
  };

  const submitPwd = async () => {
    if (!pwdDoctor?.id) return;
    if (!pwdValue || pwdValue.length < 6) {
      return toast('Нууц үг 6+ тэмдэгт байна.', 'error');
    }
    try {
      await api.put(`/doctors/${pwdDoctor.id}/password`, { password: pwdValue });
      toast('Нууц үг шинэчлэгдлээ!');
      setPwdModal(false);
      setPwdDoctor(null);
      setPwdValue('');
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    }
  };

  return (
    <div className="fade-up">
      <PageHeader title="Эмч нар" subtitle="Бүртгэлтэй эмч нарын жагсаалт" />
      <SearchBar className={styles.doctorSearchBar}>
        <SearchInput placeholder="Хайх эмчийн нэрээ оруулна уу..." onChange={filter} />
        {isAdmin && (
          <Btn className={`${styles.addBtn} ${styles.doctorAddBtn}`} onClick={() => { setEditingId(null); setAutoPassword(true); setCreatedCredentials(null); setModal(true); }}>
            <span className={styles.addFull}>＋ Эмч нэмэх</span>
            <span className={styles.addShort}>＋ Нэмэх</span>
          </Btn>
        )}
      </SearchBar>

      <TableCard className={styles.doctorsTableCard}>
        <table className={`${styles.table} ${styles.doctorsTable}`}>
          <thead>
            <tr>
              <th>№</th><th>Зураг</th><th>Нэр</th><th>Тасаг</th><th>Имэйл</th><th>Утас</th><th>Туршлага</th>{isAdmin && <th>Албан тушаал</th>}<th>Өрөө</th><th>Ажлын өдрүүд</th>{isAdmin && <th>Үйлдэл</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow cols={isAdmin ? 11 : 10} /> : filtered.length === 0 ? <EmptyRow cols={isAdmin ? 11 : 10} /> :
              filtered.map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={getDoctorPhoto(d)}
                      alt={`${d.first_name} ${d.last_name}`}
                      className={styles.doctorThumb}
                    />
                  </td>
                  <td><strong>{d.first_name} {d.last_name}</strong></td>
                  <td>{d.specialization || '—'}</td>
                  <td>{d.email}</td>
                  <td>{d.phone || '—'}</td>
                  <td>{d.experience_years ? `${d.experience_years} жил` : '—'}</td>
                  {isAdmin && <td>{d.position_title || '—'}</td>}
                  <td>{d.room_number || '—'}</td>
                  <td>{d.available_days || '—'}</td>
                  {isAdmin && (
                    <td>
                      <div className={styles.actions}>
                        <Btn size="sm" variant="outline" className={`${styles.iconBtn} ${styles.editBtn}`} title="Засах" aria-label="Засах" onClick={() => openEdit(d)}>
                          <EditIcon />
                        </Btn>
                        <Btn size="sm" variant="danger" className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Устгах" aria-label="Устгах" onClick={() => setDeleteDoctor(d)}>
                          <TrashIcon />
                        </Btn>
                        <Btn size="sm" variant="outline" className={`${styles.iconBtn} ${styles.passwordBtn}`} title="Нууц үг" aria-label="Нууц үг" onClick={() => openPwd(d)}>
                          <KeyIcon />
                        </Btn>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            }
          </tbody>
        </table>
      </TableCard>

      <div className={styles.doctorMobileList}>
        {loading ? (
          <div className={styles.doctorCard}>Ачаалж байна...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.doctorCard}>Эмч олдсонгүй.</div>
        ) : filtered.map((d, i) => (
          <div className={styles.doctorCard} key={d.id}>
            <div className={styles.doctorCardTop}>
              <div className={styles.doctorMobileIdentity}>
                <img
                  src={getDoctorPhoto(d)}
                  alt={`${d.first_name} ${d.last_name}`}
                  className={styles.doctorMobilePhoto}
                />
                <span className={styles.patientNo}>#{i + 1}</span>
              </div>
              <span className="badge confirmed">{d.specialization || '—'}</span>
            </div>
            <strong>{d.first_name} {d.last_name}</strong>
            <span>{d.email}</span>
            <div className={styles.doctorCardMeta}>
              <span>{d.phone || '—'}</span>
              <span>Өрөө: {d.room_number || '—'}</span>
            </div>
            <div className={styles.doctorCardMeta}>
              <span>{d.experience_years ? `${d.experience_years} жил` : 'Туршлага —'}</span>
              <span>{d.available_days || 'Ажлын өдөр —'}</span>
            </div>
            {isAdmin && (
              <div className={styles.actions}>
                <Btn size="sm" variant="outline" className={`${styles.iconBtn} ${styles.editBtn}`} title="Засах" aria-label="Засах" onClick={() => openEdit(d)}>
                  <EditIcon />
                </Btn>
                <Btn size="sm" variant="danger" className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Устгах" aria-label="Устгах" onClick={() => setDeleteDoctor(d)}>
                  <TrashIcon />
                </Btn>
                <Btn size="sm" variant="outline" className={`${styles.iconBtn} ${styles.passwordBtn}`} title="Нууц үг" aria-label="Нууц үг" onClick={() => openPwd(d)}>
                  <KeyIcon />
                </Btn>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <Modal open={modal} onClose={() => { setModal(false); setEditingId(null); }} title={editingId ? 'Эмч засах' : 'Эмч нэмэх'}>
          <FormGrid style={{ gap: '.6rem' }}>
            <Field label="Нэр"><Input value={form.first_name} onChange={set('first_name')} /></Field>
            <Field label="Овог"><Input value={form.last_name} onChange={set('last_name')}/></Field>
            <Field label="Тасаг">
              <Select value={form.specialization} onChange={set('specialization')}>
                <option value="">Тасаг сонгох</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </Select>
            </Field>
            <Field label="Утас"><Input value={form.phone} onChange={set('phone')} placeholder="99001122" /></Field>
            <Field label="Өрөөний дугаар"><Input value={form.room_number} onChange={set('room_number')} placeholder="101" /></Field>
            <Field label="Албан тушаал">
              <Select value={form.position_title} onChange={set('position_title')}>
                <option value="">Албан тушаал сонгох</option>
                <option value="Резидент эмч">Резидент эмч</option>
                <option value="Ээлжийн эмч">Ээлжийн эмч</option>
                <option value="Үзлэгийн эмч">Үзлэгийн эмч</option>
                <option value="Тасгийн эмч">Тасгийн эмч</option>
                <option value="Ахлах эмч">Ахлах эмч</option>
                <option value="Эрхлэгч эмч">Эрхлэгч эмч</option>
                <option value="Зөвлөх эмч">Зөвлөх эмч</option>
              </Select>
            </Field>
            <Field label="Ажлын өдрүүд"><Input value={form.available_days} onChange={set('available_days')} placeholder="Mon-Sun"/></Field>
            <Field label="Туршлага (жил)"><Input type="number" value={form.experience_years} onChange={set('experience_years')} /></Field>
            {editingId && <Field label="Имэйл"><Input type="email" value={form.email} onChange={set('email')} /></Field>}
            {!editingId && (
              <>
                <Field label="Имэйл"><Input type="email" value={form.email} onChange={set('email')} placeholder="doctor@example.com" /></Field>
                <Field label="Түр нууц үг үүсгэх">
                  <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
                    <input type="checkbox" checked={autoPassword} onChange={e => setAutoPassword(e.target.checked)} />
                    <span style={{ fontSize:'.85rem', color:'var(--muted)' }}>Систем автоматаар үүсгэнэ</span>
                  </div>
                </Field>
                {!autoPassword && (
                  <Field label="Нууц үг"><PasswordInput value={form.password} onChange={set('password')} placeholder="Doc1234!" /></Field>
                )}
              </>
            )}
          </FormGrid>
          <ModalFooter>
            <Btn variant="outline" onClick={() => { setModal(false); setEditingId(null); }}>Болих</Btn>
            <Btn onClick={submit}>{editingId ? 'Шинэчлэх' : 'Хадгалах'}</Btn>
          </ModalFooter>
        </Modal>
      )}

      {isAdmin && (
        <Modal open={!!deleteDoctor} onClose={() => setDeleteDoctor(null)} title="Эмч устгах">
          <div className={styles.confirmBox}>
            <div className={styles.confirmIcon}><TrashIcon /></div>
            <div>
              <h3 className={styles.confirmTitle}>Энэ эмчийг устгах уу?</h3>
              <p className={styles.confirmText}>
                {deleteDoctor ? `${deleteDoctor.first_name} ${deleteDoctor.last_name}` : ''} эмчийн бүртгэлийг системээс устгана.
              </p>
            </div>
          </div>
          <ModalFooter>
            <Btn variant="outline" onClick={() => setDeleteDoctor(null)}>Болих</Btn>
            <Btn variant="danger" onClick={remove}>Устгах</Btn>
          </ModalFooter>
        </Modal>
      )}

      {isAdmin && (
        <Modal open={!!createdCredentials} onClose={() => setCreatedCredentials(null)} title="Эмчийн нэвтрэх мэдээлэл">
          <div className={styles.credentialsBox}>
            <p className={styles.credentialsNote}>
              Энэ мэдээллээр эмч шууд системд нэвтэрнэ. Нууц үгийг хаахаас өмнө эмчид дамжуулаарай.
            </p>
            <div className={styles.credentialsGrid}>
              <span>Имэйл</span>
              <strong>{createdCredentials?.email || '—'}</strong>
              <span>Нэвтрэх нэр</span>
              <strong>{createdCredentials?.username || createdCredentials?.email || '—'}</strong>
              <span>Нууц үг</span>
              <strong>{createdCredentials?.password || '—'}</strong>
            </div>
          </div>
          <ModalFooter>
            <Btn onClick={() => setCreatedCredentials(null)}>Ойлголоо</Btn>
          </ModalFooter>
        </Modal>
      )}

      {isAdmin && (
        <Modal open={pwdModal} onClose={() => { setPwdModal(false); setPwdDoctor(null); }} title="Нууц үг шинэчлэх">
          <FormGrid style={{ gap: '.6rem' }}>
            <Field label="Эмч">
              <Input value={pwdDoctor ? `${pwdDoctor.first_name} ${pwdDoctor.last_name}` : ''} disabled />
            </Field>
            <Field label="Шинэ нууц үг">
              <PasswordInput value={pwdValue} onChange={e => setPwdValue(e.target.value)} placeholder="••••••••" />
            </Field>
          </FormGrid>
          <ModalFooter>
            <Btn variant="outline" onClick={() => { setPwdModal(false); setPwdDoctor(null); }}>Болих</Btn>
            <Btn onClick={submitPwd}>Шинэчлэх</Btn>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
