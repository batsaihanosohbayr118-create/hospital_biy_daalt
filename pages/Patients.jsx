import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { PageHeader, SearchBar, SearchInput, Btn, TableCard, TableHeader, EmptyRow, LoadingRow, Field, Input, Select, FormGrid, ModalFooter } from '../components/UI';
import { useToast } from '../ToastContext';
import styles from './Table.module.css';

export default function Patients() {
  const toast = useToast();
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ user_id: '', first_name: '', last_name: '', date_of_birth: '', gender: 'male', phone: '', address: '', blood_type: 'A+' });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patients');
      setAll(data.patients); setFiltered(data.patients);
    } catch { toast('Мэдээлэл ачаалахад алдаа гарлаа.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filter = e => {
    const q = e.target.value.toLowerCase();
    setFiltered(all.filter(p => `${p.first_name} ${p.last_name} ${p.email}`.toLowerCase().includes(q)));
  };

  const submit = async () => {
    try {
      await api.post('/patients', { ...form, user_id: +form.user_id });
      toast('Өвчтөн амжилттай нэмэгдлээ!');
      setModal(false);
      setForm({ user_id: '', first_name: '', last_name: '', date_of_birth: '', gender: 'male', phone: '', address: '', blood_type: 'A+' });
      load();
    } catch (e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  return (
    <div className="fade-up">
      <PageHeader title="Өвчтөнүүд" subtitle="Бүртгэлтэй өвчтөнүүдийн жагсаалт" />
      <SearchBar>
        <SearchInput placeholder="🔍  Хайх..." onChange={filter} />
        <Btn onClick={() => setModal(true)}>＋ Өвчтөн нэмэх</Btn>
      </SearchBar>

      <TableCard>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Нэр</th><th>Имэйл</th><th>Утас</th><th>Цусны бүлэг</th><th>Хүйс</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow cols={5} /> : filtered.length === 0 ? <EmptyRow cols={5} /> :
              filtered.map(p => (
                <tr key={p.id}>
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

      <Modal open={modal} onClose={() => setModal(false)} title="Өвчтөн нэмэх">
        <FormGrid>
          <Field label="Нэр"><Input value={form.first_name} onChange={set('first_name')}/></Field>
          <Field label="Овог"><Input value={form.last_name} onChange={set('last_name')}/></Field>
          <Field label="Утас"><Input value={form.phone} onChange={set('phone')}/></Field>
          <Field label="Хүйс">
            <Select value={form.gender} onChange={set('gender')}>
              <option value="male">Эрэгтэй</option>
              <option value="female">Эмэгтэй</option>
              <option value="other">Бусад</option>
            </Select>
          </Field>
          <Field label="Цусны бүлэг">
            <Select value={form.blood_type} onChange={set('blood_type')}>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
            </Select>
          </Field>
          <Field label="Төрсөн огноо"><Input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} /></Field>
          <Field label="Хаяг"><Input value={form.address} onChange={set('address')} /></Field>
        </FormGrid>
        <ModalFooter>
          <Btn variant="outline" onClick={() => setModal(false)}>Болих</Btn>
          <Btn onClick={submit}>Хадгалах</Btn>
        </ModalFooter>
      </Modal>
    </div>
  );
}
