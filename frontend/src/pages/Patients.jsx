import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { PageHeader, SearchBar, SearchInput, TableCard, EmptyRow, LoadingRow, Btn, Field, Input, Select, FormGrid, ModalFooter } from '../components/UI';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';
import styles from './Table.module.css';

const bloodOptions = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const currentYear = new Date().getFullYear();
const birthYears = Array.from({ length: currentYear - 1899 }, (_, i) => String(currentYear - i));
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const daysInMonth = (year, month) => {
  if (!year || !month) return 31;
  return new Date(Number(year), Number(month), 0).getDate();
};

export default function Patients() {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' });
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: 'male',
    blood_type: 'A+',
    date_of_birth: '',
    registry_number: '',
    address: ''
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patients');
      setAll(data.patients); setFiltered(data.patients);
    } catch { toast('Мэдээлэл ачаалахад алдаа гарлаа.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const set = k => e => {
    let v = e.target.value;
    if (k === 'registry_number') {
      const letters = (v.match(/[А-ЯӨҮа-яөү]/g) || []).join('').toUpperCase().slice(0, 2);
      const digits = (v.match(/\d/g) || []).join('').slice(0, 8);
      v = `${letters}${digits}`.slice(0, 10);
    }
    setForm(f => ({ ...f, [k]: v }));
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
  };

  const resetForm = () => {
    setForm({
      email: '',
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      gender: 'male',
      blood_type: 'A+',
      date_of_birth: '',
      registry_number: '',
      address: ''
    });
    setBirthDate({ year: '', month: '', day: '' });
  };

  const openCreate = () => {
    resetForm();
    setModal(true);
  };

  const submit = async () => {
    if (!form.email || !form.first_name || !form.last_name || !form.date_of_birth || !form.gender) {
      return toast('Имэйл, нэр, овог, төрсөн огноо, хүйс заавал.', 'error');
    }
    setSaving(true);
    try {
      const { data } = await api.post('/patients', form);
      toast(data.tempPassword ? `Өвчтөн нэмэгдлээ. Нууц үг: ${data.tempPassword}` : 'Өвчтөн нэмэгдлээ.');
      setModal(false);
      resetForm();
      load();
    } catch (e) {
      toast(e.response?.data?.error || 'Өвчтөн нэмэхэд алдаа гарлаа.', 'error');
    } finally {
      setSaving(false);
    }
  };

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
    setFiltered(all.filter(p => {
      if (!q) return true;
      const first = normalize(p.first_name);
      const last = normalize(p.last_name);
      return first.startsWith(q) || last.startsWith(q);
    }));
  };

  return (
    <div className="fade-up">
      <PageHeader title="Өвчтөнүүд" subtitle="Бүртгэлтэй өвчтөнүүдийн жагсаалт" />
      <SearchBar className={styles.patientSearchBar}>
        <SearchInput placeholder="Хайх..." onChange={filter} />
        {isAdmin && (
          <Btn className={styles.patientAddBtn} onClick={openCreate}>
            <span className={styles.addFull}>＋ Өвчтөн нэмэх</span>
            <span className={styles.addShort}>＋ Нэмэх</span>
          </Btn>
        )}
      </SearchBar>

      <TableCard className={styles.patientsTableCard}>
        <table className={`${styles.table} ${styles.patientsTable}`}>
          <thead>
            <tr>
              <th>№</th><th>Нэр</th><th>Имэйл</th><th>Утас</th><th>Цусны бүлэг</th><th>Хүйс</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow cols={6} /> : filtered.length === 0 ? <EmptyRow cols={6} /> :
              filtered.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td><strong>{p.first_name} {p.last_name}</strong></td>
                  <td>{p.email}</td>
                  <td>{p.phone || '—'}</td>
                  <td><span className="badge confirmed">{p.blood_type || '—'}</span></td>
                  <td>{p.gender === 'male' ? 'Эрэгтэй' : p.gender === 'female' ? 'Эмэгтэй' : '—'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </TableCard>

      <div className={styles.patientMobileList}>
        {loading ? (
          <div className={styles.patientCard}>Ачаалж байна...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.patientCard}>Өвчтөн олдсонгүй.</div>
        ) : filtered.map((p, i) => (
          <div className={styles.patientCard} key={p.id}>
            <div className={styles.patientCardTop}>
              <span className={styles.patientNo}>#{i + 1}</span>
              <span className="badge confirmed">{p.blood_type || '—'}</span>
            </div>
            <strong>{p.first_name} {p.last_name}</strong>
            <span>{p.email}</span>
            <div className={styles.patientCardMeta}>
              <span>{p.phone || '—'}</span>
              <span>{p.gender === 'male' ? 'Эрэгтэй' : p.gender === 'female' ? 'Эмэгтэй' : '—'}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Өвчтөн нэмэх">
        <FormGrid className={styles.patientCreateForm}>
          <Field label="Имэйл">
            <Input type="email" value={form.email} onChange={set('email')} placeholder="patient@gmail.com" />
          </Field>
          <Field label="Нэвтрэх нэр">
            <Input value={form.username} onChange={set('username')} placeholder="Хоосон бол имэйлээс үүснэ" />
          </Field>
          <Field label="Нууц үг">
            <Input value={form.password} onChange={set('password')} placeholder="Хоосон бол автоматаар үүснэ" />
          </Field>
          <Field label="Утас">
            <Input value={form.phone} onChange={set('phone')} placeholder="99001122" />
          </Field>
          <Field label="Нэр">
            <Input value={form.first_name} onChange={set('first_name')} />
          </Field>
          <Field label="Овог">
            <Input value={form.last_name} onChange={set('last_name')} />
          </Field>
          <Field label="Хүйс">
            <Select value={form.gender} onChange={set('gender')}>
              <option value="male">Эрэгтэй</option>
              <option value="female">Эмэгтэй</option>
              <option value="other">Бусад</option>
            </Select>
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
          </Field>
          <Field label="Регистрийн дугаар">
            <Input value={form.registry_number} onChange={set('registry_number')} maxLength={10} placeholder="АА12345678" />
          </Field>
          <Field label="Хаяг">
            <Input value={form.address} onChange={set('address')} placeholder="Хот/Дүүрэг/Хороо/Тоот" />
          </Field>
        </FormGrid>
        <ModalFooter>
          <Btn variant="outline" onClick={() => setModal(false)} disabled={saving}>Болих</Btn>
          <Btn onClick={submit} disabled={saving}>{saving ? 'Хадгалж байна...' : 'Хадгалах'}</Btn>
        </ModalFooter>
      </Modal>
    </div>
  );
}
