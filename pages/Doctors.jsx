import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { PageHeader, SearchBar, SearchInput, Btn, TableCard, EmptyRow, LoadingRow, Field, Input, FormGrid, ModalFooter } from '../components/UI';
import { useToast } from '../ToastContext';
import styles from './Table.module.css';

export default function Doctors() {
  const toast = useToast();
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ user_id: '', first_name: '', last_name: '', specialization: '', phone: '', license_number: '', available_days: '' });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors');
      setAll(data.doctors); setFiltered(data.doctors);
    } catch { toast('Мэдээлэл ачаалахад алдаа гарлаа.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filter = e => {
    const q = e.target.value.toLowerCase();
    setFiltered(all.filter(d => `${d.first_name} ${d.last_name} ${d.specialization} ${d.email}`.toLowerCase().includes(q)));
  };

  const submit = async () => {
    try {
      await api.post('/doctors', { ...form, user_id: +form.user_id });
      toast('Эмч амжилттай нэмэгдлээ!');
      setModal(false);
      setForm({ user_id: '', first_name: '', last_name: '', specialization: '', phone: '', license_number: '', available_days: '' });
      load();
    } catch (e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  return (
    <div className="fade-up">
      <PageHeader title="Эмч нар" subtitle="Бүртгэлтэй эмч нарын жагсаалт" />
      <SearchBar>
        <SearchInput placeholder="🔍  Хайх..." onChange={filter} />
        <Btn onClick={() => setModal(true)}>＋ Эмч нэмэх</Btn>
      </SearchBar>

      <TableCard>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Нэр</th><th>Мэргэжил</th><th>Имэйл</th><th>Утас</th><th>Ажлын өдрүүд</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow cols={5} /> : filtered.length === 0 ? <EmptyRow cols={5} /> :
              filtered.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.first_name} {d.last_name}</strong></td>
                  <td><span className="badge doctor">{d.specialization}</span></td>
                  <td>{d.email}</td>
                  <td>{d.phone || '—'}</td>
                  <td>{d.available_days || '—'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </TableCard>

      <Modal open={modal} onClose={() => setModal(false)} title="Эмч нэмэх">
        <FormGrid>
          <Field label="Нэр"><Input value={form.first_name} onChange={set('first_name')} /></Field>
          <Field label="Овог"><Input value={form.last_name} onChange={set('last_name')}/></Field>
          <Field label="Мэргэжил"><Input value={form.specialization} onChange={set('specialization')}/></Field>
          <Field label="Утас"><Input value={form.phone} onChange={set('phone')} placeholder="99001122" /></Field>
          <Field label="Лиценз №"><Input value={form.license_number} onChange={set('license_number')}/></Field>
          <Field label="Ажлын өдрүүд"><Input value={form.available_days} onChange={set('available_days')}/></Field>
        </FormGrid>
        <ModalFooter>
          <Btn variant="outline" onClick={() => setModal(false)}>Болих</Btn>
          <Btn onClick={submit}>Хадгалах</Btn>
        </ModalFooter>
      </Modal>
    </div>
  );
}
