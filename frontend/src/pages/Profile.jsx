import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api';
import { useToast } from '../ToastContext';
import { PageHeader, Btn, Field, Input, PasswordInput, Select, FormGrid, TableCard } from '../components/UI';
import { useAuth } from '../AuthContext';
import styles from './Profile.module.css';

const bloodOptions = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const currentYear = new Date().getFullYear();
const birthYears = Array.from({ length: currentYear - 1899 }, (_, i) => String(currentYear - i));
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const weekDayOptions = [
  { value: 'Mon', label: 'Даваа' },
  { value: 'Tue', label: 'Мягмар' },
  { value: 'Wed', label: 'Лхагва' },
  { value: 'Thu', label: 'Пүрэв' },
  { value: 'Fri', label: 'Баасан' },
  { value: 'Sat', label: 'Бямба' },
  { value: 'Sun', label: 'Ням' }
];

const daysInMonth = (year, month) => {
  if (!year || !month) return 31;
  return new Date(Number(year), Number(month), 0).getDate();
};

const toInputDate = v => {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const splitDate = v => {
  const [year = '', month = '', day = ''] = (v || '').split('-');
  return { year, month, day };
};

const normalizeDays = v => {
  if (!v) return [];
  if (v === 'Mon-Fri') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return String(v).split(',').map(x => x.trim()).filter(Boolean);
};

const formatDays = v => {
  const days = normalizeDays(v);
  if (days.length === 0) return '—';
  return days.map(d => weekDayOptions.find(opt => opt.value === d)?.label || d).join(', ');
};

const profilePhotoKey = user => `hms_profile_photo_${user?.id || user?.email || 'guest'}`;

const resizeImage = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const maxSize = 720;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = reject;
    img.src = reader.result;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

function ProfilePhoto({ photo, fallback, onPick, onRemove, disabled }) {
  return (
    <div className={styles.photoBlock}>
      <button
        type="button"
        className={styles.photoButton}
        onClick={onPick}
        disabled={disabled}
        aria-label="Профайл зураг солих"
        title="Зураг солих"
      >
        {photo ? (
          <img src={photo} alt="Профайл зураг" className={styles.photoImg} />
        ) : (
          <span className={styles.avatar}>{fallback}</span>
        )}
        <span className={styles.photoOverlay}>Солих</span>
      </button>
      <div className={styles.photoActions}>
        <button type="button" onClick={onPick} disabled={disabled}>Зураг сонгох</button>
        {photo && <button type="button" onClick={onRemove} disabled={disabled}>Устгах</button>}
      </div>
    </div>
  );
}

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6v5h-5" />
    <path d="M4 18v-5h5" />
    <path d="M18.2 9A7 7 0 0 0 6.4 6.3L4 8.5" />
    <path d="M5.8 15A7 7 0 0 0 17.6 17.7L20 15.5" />
  </svg>
);

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const photoInputRef = useRef(null);
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [doctorErrors, setDoctorErrors] = useState({});
  const [adminErrors, setAdminErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [adminEditing, setAdminEditing] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [doctorEditing, setDoctorEditing] = useState(false);
  const [adminForm, setAdminForm] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [doctorForm, setDoctorForm] = useState({
    first_name: '',
    last_name: '',
    specialization: 'Дотор',
    phone: '',
    room_number: '',
    position_title: '',
    available_days: 'Mon-Fri',
    experience_years: '',
    license_number: ''
  });
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    phone: '',
    address: '',
    blood_type: 'A+',
    registry_number: ''
  });
  const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });

  useEffect(() => {
    try {
      setPhoto(localStorage.getItem(profilePhotoKey(user)) || '');
    } catch {
      setPhoto('');
    }
  }, [user]);

  const syncPhoto = nextPhoto => {
    setPhoto(nextPhoto);
    window.dispatchEvent(new CustomEvent('hms-profile-photo-change', { detail: { photo: nextPhoto } }));
  };

  const pickPhoto = () => {
    photoInputRef.current?.click();
  };

  const handlePhotoChange = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return toast('Зөвхөн зураг файл сонгоно уу.', 'error');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast('Зургийн хэмжээ 5MB-аас бага байх ёстой.', 'error');
    }
    try {
      const nextPhoto = await resizeImage(file);
      localStorage.setItem(profilePhotoKey(user), nextPhoto);
      syncPhoto(nextPhoto);
      toast('Профайл зураг шинэчлэгдлээ.');
    } catch {
      toast('Зураг уншихад алдаа гарлаа.', 'error');
    }
  };

  const removePhoto = () => {
    localStorage.removeItem(profilePhotoKey(user));
    syncPhoto('');
    toast('Профайл зураг устгагдлаа.');
  };

  const photoInput = (
    <input
      ref={photoInputRef}
      className={styles.hiddenFile}
      type="file"
      accept="image/*"
      onChange={handlePhotoChange}
    />
  );

  const set = k => e => {
    let v = e.target.value;
    if (k === 'registry_number') {
      const letters = (v.match(/[А-ЯӨҮа-яөү]/g) || []).join('').toUpperCase().slice(0, 2);
      const digits = (v.match(/\d/g) || []).join('').slice(0, 8);
      v = `${letters}${digits}`.slice(0, 10);
    }
    setForm(f => ({ ...f, [k]: v }));
    setErrors(errs => ({ ...errs, [k]: '' }));
  };

  const setBirthPart = part => e => {
    const value = e.target.value;
    setBirthDate(prev => {
      const year = part === 'year' ? value : prev.year;
      const month = part === 'month' ? value : prev.month;
      let day = part === 'day' ? value : prev.day;
      if (year && month && day) {
        const maxDay = daysInMonth(year, month);
        if (Number(day) > maxDay) day = String(maxDay).padStart(2, '0');
      }
      const date_of_birth = year && month && day ? `${year}-${month}-${day}` : '';
      setForm(f => ({ ...f, date_of_birth }));
      return { year, month, day };
    });
    setErrors(errs => ({ ...errs, date_of_birth: '' }));
  };

  const setDoctor = k => e => {
    const v = e.target.value;
    setDoctorForm(f => ({ ...f, [k]: v }));
    setDoctorErrors(errs => ({ ...errs, [k]: '' }));
  };

  const setAdmin = k => e => {
    const v = e.target.value;
    setAdminForm(f => ({ ...f, [k]: v }));
    setAdminErrors(errs => ({ ...errs, [k]: '' }));
  };

  const toggleDoctorDay = day => {
    setDoctorForm(f => {
      const days = normalizeDays(f.available_days);
      const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day];
      return { ...f, available_days: next.join(',') };
    });
    setDoctorErrors(errs => ({ ...errs, available_days: '' }));
  };

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const { data } = await api.get('/patients/me');
      if (data?.profile === null) {
        setNotFound(true);
        setEmail(data.email || '');
        setForm({ first_name: '', last_name: '', date_of_birth: '', gender: 'male', phone: '', address: '', blood_type: 'A+', registry_number: '' });
        setBirthDate({ year: '', month: '', day: '' });
        setErrors({});
        setEditing(true);
        return;
      }
      const nextDate = toInputDate(data.date_of_birth);
      setEmail(data.email || '');
      setForm({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        date_of_birth: nextDate,
        gender: data.gender || 'male',
        phone: data.phone || '',
        address: data.address || '',
        blood_type: data.blood_type || 'A+',
        registry_number: data.registry_number || ''
      });
      setBirthDate(splitDate(nextDate));
      setEditing(false);
    } catch (e) {
      toast(e.response?.data?.error || 'Профайл ачаалахад алдаа гарлаа.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadDoctor = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors/me');
      setEmail(data.email || '');
      setDoctorProfile(data.profile || null);
      setDoctorForm({
        first_name: data.profile?.first_name || '',
        last_name: data.profile?.last_name || '',
        specialization: data.profile?.specialization || 'Дотор',
        phone: data.profile?.phone || '',
        room_number: data.profile?.room_number || '',
        position_title: data.profile?.position_title || '',
        available_days: data.profile?.available_days || 'Mon-Fri',
        experience_years: data.profile?.experience_years ?? '',
        license_number: data.profile?.license_number || ''
      });
      setDoctorEditing(!data.profile);
    } catch (e) {
      toast(e.response?.data?.error || 'Профайл ачаалахад алдаа гарлаа.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadAdmin = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/me');
      const nextUser = data.user || {};
      setEmail(nextUser.email || '');
      setAdminForm({
        email: nextUser.email || '',
        username: nextUser.username || '',
        password: ''
      });
      setAdminErrors({});
      setAdminEditing(false);
      if (data.user && updateUser) updateUser(data.user);
    } catch (e) {
      toast(e.response?.data?.error || 'Аккаунт ачаалахад алдаа гарлаа.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast, updateUser]);

  useEffect(() => {
    if (isAdmin) {
      loadAdmin();
    } else if (isDoctor) {
      loadDoctor();
    } else {
      load();
    }
  }, [isAdmin, isDoctor, load, loadAdmin, loadDoctor]);

  const validate = () => {
    const next = {};
    if (!form.first_name?.trim()) next.first_name = 'Нэр заавал';
    if (!form.last_name?.trim()) next.last_name = 'Овог заавал';
    if (!form.date_of_birth) next.date_of_birth = 'Төрсөн огноо заавал';
    if (!form.gender) next.gender = 'Хүйс заавал';
    if (!form.phone) next.phone = 'Утасны дугаар заавал';
    if (!form.address) next.address = 'Гэрийн хаяг заавал';
    if (form.registry_number && !/^[А-ЯӨҮ]{2}\d{8}$/.test(form.registry_number)) {
      next.registry_number = 'Регистр: 2 монгол үсэг + 8 тоо';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      window.alert('Бүх заавал талбаруудыг бүрэн бөглөнө үү.');
    }
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        date_of_birth: form.date_of_birth || null
      };
      const { status, data } = await api.put('/patients/me', payload);
      toast(status === 201 ? 'Профайл үүсгэгдлээ.' : 'Профайл амжилттай шинэчлэгдлээ.');
      if (data?.profile) {
        setNotFound(false);
        const nextDate = toInputDate(data.profile.date_of_birth);
        setForm({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          date_of_birth: nextDate,
          gender: data.profile.gender || 'male',
          phone: data.profile.phone || '',
          address: data.profile.address || '',
          blood_type: data.profile.blood_type || 'A+',
          registry_number: data.profile.registry_number || ''
        });
        setBirthDate(splitDate(nextDate));
        setEditing(false);
      } else {
        load();
      }
    } catch (e) {
      toast(e.response?.data?.error || 'Шинэчлэхэд алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveDoctor = async () => {
    const next = {};
    if (!doctorForm.first_name?.trim()) next.first_name = 'Нэр заавал';
    if (!doctorForm.last_name?.trim()) next.last_name = 'Овог заавал';
    if (!doctorForm.specialization?.trim()) next.specialization = 'Тасаг заавал';
    if (!doctorForm.room_number?.trim()) next.room_number = 'Өрөө заавал';
    if (normalizeDays(doctorForm.available_days).length === 0) next.available_days = 'Ажлын өдөр сонгоно уу';
    if (doctorForm.experience_years === '' || Number(doctorForm.experience_years) < 0) {
      next.experience_years = 'Туршлага зөв оруулна уу';
    }
    setDoctorErrors(next);
    if (Object.keys(next).length > 0) {
      return toast('Эмчийн профайлын заавал талбаруудыг бөглөнө үү.', 'error');
    }
    setSaving(true);
    try {
      const payload = {
        ...doctorForm,
        experience_years: doctorForm.experience_years ? +doctorForm.experience_years : null
      };
      const { status, data } = await api.put('/doctors/me', payload);
      toast(status === 201 ? 'Эмчийн профайл үүсгэгдлээ.' : 'Эмчийн профайл шинэчлэгдлээ.');
      const profile = data.profile || null;
      setDoctorProfile(profile);
      if (profile) {
        setDoctorForm({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          specialization: profile.specialization || 'Дотор',
          phone: profile.phone || '',
          room_number: profile.room_number || '',
          position_title: profile.position_title || '',
          available_days: profile.available_days || 'Mon-Fri',
          experience_years: profile.experience_years ?? '',
          license_number: profile.license_number || ''
        });
      }
      setDoctorEditing(false);
    } catch (e) {
      toast(e.response?.data?.error || 'Профайл хадгалахад алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveAdmin = async () => {
    const next = {};
    if (!adminForm.email?.trim()) next.email = 'Имэйл заавал';
    if (adminForm.password && adminForm.password.length < 6) next.password = 'Нууц үг 6+ тэмдэгт байна';
    setAdminErrors(next);
    if (Object.keys(next).length > 0) {
      return toast('Аккаунтын талбаруудыг зөв бөглөнө үү.', 'error');
    }
    setSaving(true);
    try {
      const payload = {
        email: adminForm.email.trim(),
        username: adminForm.username.trim(),
        password: adminForm.password
      };
      if (!payload.password) delete payload.password;
      const { data } = await api.put('/auth/me', payload);
      if (data.user && updateUser) updateUser(data.user);
      setEmail(data.user?.email || adminForm.email);
      setAdminForm(f => ({ ...f, password: '' }));
      setAdminEditing(false);
      toast('Аккаунтын мэдээлэл шинэчлэгдлээ.');
    } catch (e) {
      toast(e.response?.data?.error || 'Аккаунт хадгалахад алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="fade-up">
        {photoInput}
        <PageHeader
          title="Миний профайл"
          subtitle="Админ аккаунтын мэдээлэл"
        >
          <div className={styles.headerActions}>
            <Btn
              variant="outline"
              className={styles.refreshBtn}
              onClick={loadAdmin}
              disabled={loading || saving}
              aria-label="Дахин ачаалах"
              title="Дахин ачаалах"
            >
              <RefreshIcon />
            </Btn>
            {adminEditing ? (
              <>
                <Btn variant="outline" onClick={() => { setAdminEditing(false); loadAdmin(); }} disabled={loading || saving}>Болих</Btn>
                <Btn onClick={saveAdmin} disabled={loading || saving}>{saving ? 'Хадгалж байна...' : 'Хадгалах'}</Btn>
              </>
            ) : (
              <Btn onClick={() => setAdminEditing(true)} disabled={loading || saving}>Засах</Btn>
            )}
          </div>
        </PageHeader>

        <div className={styles.grid}>
          <TableCard>
            <div className={styles.profileCard}>
              <ProfilePhoto
                photo={photo}
                fallback={(user?.username?.[0] || email?.[0] || '?').toUpperCase()}
                onPick={pickPhoto}
                onRemove={removePhoto}
                disabled={loading || saving}
              />
              <div>
                <h3 className={styles.name}>{user?.username || 'Админ'}</h3>
                <p className={styles.email}>{email || user?.email || '—'}</p>
                <div className={styles.badges}>
                  <span className="badge admin">Админ</span>
                </div>
              </div>
            </div>
            <div className={styles.meta}>
              <div>
                <span className={styles.metaLabel}>Имэйл</span>
                <p className={styles.metaValue}>{adminForm.email || user?.email || '—'}</p>
              </div>
              <div>
                <span className={styles.metaLabel}>Нэвтрэх нэр</span>
                <p className={styles.metaValue}>{adminForm.username || user?.username || '—'}</p>
              </div>
              <div>
                <span className={styles.metaLabel}>Эрх</span>
                <p className={styles.metaValue}>Админ</p>
              </div>
            </div>
          </TableCard>

          <TableCard>
            {loading ? (
              <div className={styles.loading}>Ачаалж байна...</div>
            ) : adminEditing ? (
              <FormGrid className={styles.patientForm}>
                <Field label="Имэйл">
                  <Input type="email" value={adminForm.email} onChange={setAdmin('email')} />
                  {adminErrors.email && <small className={styles.error}>{adminErrors.email}</small>}
                </Field>
                <Field label="Нэвтрэх нэр">
                  <Input value={adminForm.username} onChange={setAdmin('username')} placeholder="Хоосон байж болно" />
                </Field>
                <Field label="Шинэ нууц үг">
                  <PasswordInput value={adminForm.password} onChange={setAdmin('password')} placeholder="Хоосон бол солихгүй" />
                  {adminErrors.password && <small className={styles.error}>{adminErrors.password}</small>}
                </Field>
              </FormGrid>
            ) : (
              <div className={styles.readonlyHint}>Засах товч дарж аккаунтын мэдээллээ өөрчлөөрэй.</div>
            )}
          </TableCard>
        </div>
      </div>
    );
  }

  if (isDoctor) {
    return (
      <div className="fade-up">
        {photoInput}
        <PageHeader
          title="Миний профайл"
          subtitle="Өөрийн мэдээллээ харах, засах"
        >
          <div className={styles.headerActions}>
            <Btn
              variant="outline"
              className={styles.refreshBtn}
              onClick={loadDoctor}
              disabled={loading || saving}
              aria-label="Дахин ачаалах"
              title="Дахин ачаалах"
            >
              <RefreshIcon />
            </Btn>
            {doctorEditing ? (
              <>
                <Btn variant="outline" onClick={() => { setDoctorEditing(false); loadDoctor(); }} disabled={loading || saving || !doctorProfile}>Болих</Btn>
                <Btn onClick={saveDoctor} disabled={loading || saving}>{saving ? 'Хадгалж байна...' : 'Хадгалах'}</Btn>
              </>
            ) : (
              <Btn onClick={() => setDoctorEditing(true)} disabled={loading || saving}>Засах</Btn>
            )}
          </div>
        </PageHeader>

        <div className={styles.grid}>
          <TableCard>
            <div className={styles.profileCard}>
              <ProfilePhoto
                photo={photo}
                fallback={(doctorProfile?.first_name?.[0] || email?.[0] || '?').toUpperCase()}
                onPick={pickPhoto}
                onRemove={removePhoto}
                disabled={loading || saving}
              />
              <div>
                <h3 className={styles.name}>
                  {doctorProfile?.first_name || '—'} {doctorProfile?.last_name || ''}
                </h3>
                <p className={styles.email}>{email || '—'}</p>
                <div className={styles.badges}>
                  <span className="badge doctor">Эмч</span>
                  {doctorProfile?.specialization && <span className="badge confirmed">{doctorProfile.specialization}</span>}
                </div>
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>Ачаалж байна...</div>
            ) : !doctorProfile ? (
              <div className={styles.notice}>Эмчийн профайл олдсонгүй. Баруун талын талбаруудыг бөглөж хадгалаарай.</div>
            ) : (
              <div className={styles.meta}>
                <div>
                  <span className={styles.metaLabel}>Утас</span>
                  <p className={styles.metaValue}>{doctorProfile.phone || '—'}</p>
                </div>
                <div>
                  <span className={styles.metaLabel}>Өрөө</span>
                  <p className={styles.metaValue}>{doctorProfile.room_number || '—'}</p>
                </div>
                <div>
                  <span className={styles.metaLabel}>Албан тушаал</span>
                  <p className={styles.metaValue}>{doctorProfile.position_title || '—'}</p>
                </div>
                <div>
                  <span className={styles.metaLabel}>Туршлага (жил)</span>
                  <p className={styles.metaValue}>{doctorProfile.experience_years ?? '—'}</p>
                </div>
                <div className={styles.metaWide}>
                  <span className={styles.metaLabel}>Ажлын өдрүүд</span>
                  <p className={styles.metaValue}>{formatDays(doctorProfile.available_days)}</p>
                </div>
              </div>
            )}
          </TableCard>

          <TableCard>
            {doctorEditing ? (
              <>
                {!doctorProfile && (
                  <div className={styles.notice}>Профайл үүсгээгүй байна. Доорх мэдээллээ бөглөж хадгалаарай.</div>
                )}
                <FormGrid className={styles.doctorForm}>
                  <Field label="Нэр">
                    <Input value={doctorForm.first_name} onChange={setDoctor('first_name')} />
                    {doctorErrors.first_name && <small className={styles.error}>{doctorErrors.first_name}</small>}
                  </Field>
                  <Field label="Овог">
                    <Input value={doctorForm.last_name} onChange={setDoctor('last_name')} />
                    {doctorErrors.last_name && <small className={styles.error}>{doctorErrors.last_name}</small>}
                  </Field>
                  <Field label="Тасаг">
                    <Select value={doctorForm.specialization} onChange={setDoctor('specialization')}>
                      {['Дотор','Хүүхэд','Мэс засал','Эмэгтэйчүүд','Мэдрэл','Зүрх судас','Шүд','Нүд','Чих хамар хоолой','Яаралтай тусламж'].map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </Select>
                    {doctorErrors.specialization && <small className={styles.error}>{doctorErrors.specialization}</small>}
                  </Field>
                  <Field label="Утас"><Input value={doctorForm.phone} onChange={setDoctor('phone')} placeholder="99001122" /></Field>
                  <Field label="Өрөө">
                    <Input value={doctorForm.room_number} onChange={setDoctor('room_number')} placeholder="101" />
                    {doctorErrors.room_number && <small className={styles.error}>{doctorErrors.room_number}</small>}
                  </Field>
                  <Field label="Албан тушаал"><Input value={doctorForm.position_title} onChange={setDoctor('position_title')} placeholder="Эмч" /></Field>
                  <Field label="Ажлын өдрүүд">
                    <div className={styles.dayPicker}>
                      {weekDayOptions.map(day => {
                        const active = normalizeDays(doctorForm.available_days).includes(day.value);
                        return (
                          <button
                            key={day.value}
                            type="button"
                            className={`${styles.dayBtn} ${active ? styles.dayBtnActive : ''}`}
                            onClick={() => toggleDoctorDay(day.value)}
                          >
                            {day.label.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                    {doctorErrors.available_days && <small className={styles.error}>{doctorErrors.available_days}</small>}
                  </Field>
                  <Field label="Туршлага (жил)">
                    <Input type="number" min="0" value={doctorForm.experience_years} onChange={setDoctor('experience_years')} />
                    {doctorErrors.experience_years && <small className={styles.error}>{doctorErrors.experience_years}</small>}
                  </Field>
                </FormGrid>
              </>
            ) : (
              <div className={styles.readonlyHint}>Засах товч дарж мэдээллээ өөрчлөөрэй.</div>
            )}
          </TableCard>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      {photoInput}
      <PageHeader
        title="Миний профайл"
        subtitle="Өөрийн мэдээллээ харах, засах"
      >
        <div className={styles.headerActions}>
          <Btn
            variant="outline"
            className={styles.refreshBtn}
            onClick={load}
            disabled={loading || saving}
            aria-label="Дахин ачаалах"
            title="Дахин ачаалах"
          >
            <RefreshIcon />
          </Btn>
          {editing ? (
            <>
              <Btn variant="outline" onClick={() => { setEditing(false); setErrors({}); load(); }} disabled={loading || saving}>Болих</Btn>
              <Btn onClick={save} disabled={loading || saving}>{saving ? 'Хадгалж байна...' : 'Хадгалах'}</Btn>
            </>
          ) : (
            <Btn onClick={() => setEditing(true)} disabled={loading || saving}>Засах</Btn>
          )}
        </div>
      </PageHeader>

      <div className={styles.grid}>
        <TableCard>
          <div className={styles.profileCard}>
            <ProfilePhoto
              photo={photo}
              fallback={(form.first_name?.[0] || email?.[0] || '?').toUpperCase()}
              onPick={pickPhoto}
              onRemove={removePhoto}
              disabled={loading || saving}
            />
            <div>
              <h3 className={styles.name}>
                {form.first_name || '—'} {form.last_name || ''}
              </h3>
              <p className={styles.email}>{email || '—'}</p>
              <div className={styles.badges}>
                <span className="badge patient">Өвчтөн</span>
                <span className="badge confirmed">{form.blood_type || '—'}</span>
              </div>
            </div>
          </div>

          <div className={styles.meta}>
            <div>
              <span className={styles.metaLabel}>Хүйс</span>
              <p className={styles.metaValue}>
                {form.gender === 'male' ? 'Эрэгтэй' : form.gender === 'female' ? 'Эмэгтэй' : 'Бусад'}
              </p>
            </div>
            <div>
              <span className={styles.metaLabel}>Утас</span>
              <p className={styles.metaValue}>{form.phone || '—'}</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Төрсөн огноо</span>
              <p className={styles.metaValue}>{form.date_of_birth || '—'}</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Регистрийн дугаар</span>
              <p className={styles.metaValue}>{form.registry_number || '—'}</p>
            </div>
            <div className={styles.metaWide}>
              <span className={styles.metaLabel}>Хаяг</span>
              <p className={styles.metaValue}>{form.address || '—'}</p>
            </div>
          </div>
        </TableCard>

        <TableCard>
          {loading ? (
            <div className={styles.loading}>Ачаалж байна...</div>
          ) : editing ? (
            <>
              {notFound && (
                <div className={styles.notice}>Профайл үүсгээгүй байна. Доорх талбаруудыг бөглөж хадгалаарай.</div>
              )}
              <FormGrid className={styles.patientForm}>
              <Field label="Нэр">
                <Input value={form.first_name} onChange={set('first_name')} />
                {errors.first_name && <small className={styles.error}>{errors.first_name}</small>}
              </Field>
              <Field label="Овог">
                <Input value={form.last_name} onChange={set('last_name')} />
                {errors.last_name && <small className={styles.error}>{errors.last_name}</small>}
              </Field>
              <Field label="Утас">
                <Input value={form.phone} onChange={set('phone')} />
                {errors.phone && <small className={styles.error}>{errors.phone}</small>}
              </Field>
              <Field label="Хүйс">
                <Select value={form.gender} onChange={set('gender')}>
                  <option value="male">Эрэгтэй</option>
                  <option value="female">Эмэгтэй</option>
                  <option value="other">Бусад</option>
                </Select>
                {errors.gender && <small className={styles.error}>{errors.gender}</small>}
              </Field>
              <Field label="Цусны бүлэг">
                <Select value={form.blood_type} onChange={set('blood_type')}>
                  {bloodOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </Select>
              </Field>
              <Field label="Төрсөн огноо">
                <div className={styles.dateParts}>
                  <Select value={birthDate.year} onChange={setBirthPart('year')}>
                    <option value="">Жил</option>
                    {birthYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </Select>
                  <Select value={birthDate.month} onChange={setBirthPart('month')}>
                    <option value="">Сар</option>
                    {months.map(m => <option key={m} value={m}>{Number(m)} сар</option>)}
                  </Select>
                  <Select value={birthDate.day} onChange={setBirthPart('day')}>
                    <option value="">Өдөр</option>
                    {Array.from({ length: daysInMonth(birthDate.year, birthDate.month) }, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                      <option key={d} value={d}>{Number(d)}</option>
                    ))}
                  </Select>
                </div>
                {errors.date_of_birth && <small className={styles.error}>{errors.date_of_birth}</small>}
              </Field>
              <Field label="Регистрийн дугаар">
                <Input value={form.registry_number} onChange={set('registry_number')} maxLength={10} placeholder="АА12345678" />
                {errors.registry_number && <small className={styles.error}>{errors.registry_number}</small>}
              </Field>
              <Field label="Хаяг">
                <Input value={form.address} onChange={set('address')} placeholder="Хот/Дүүрэг/Хороо/Тоот" />
                {errors.address && <small className={styles.error}>{errors.address}</small>}
              </Field>
            </FormGrid>
            </>
          ) : (
            <div className={styles.readonlyHint}>Засах товч дарж мэдээллээ өөрчлөөрэй.</div>
          )}
        </TableCard>
      </div>
    </div>
  );
}
