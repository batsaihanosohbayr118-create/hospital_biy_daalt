import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { PageHeader, SearchBar, SearchInput, Btn, TableCard, EmptyRow, LoadingRow, Field, Input, Select, FormGrid, ModalFooter } from '../components/UI';
import { useToast } from '../ToastContext';
import styles from './Table.module.css';

const fmtDate = d => d ? new Date(d).toLocaleString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';
const statusLabel = s => ({ pending: 'Хүлээгдэж байна', confirmed: 'Баталгаажсан', completed: 'Дууссан', cancelled: 'Цуцлагдсан' })[s] || s;

export default function Appointments({ myOnly = false }) {
  const toast = useToast();
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [newStatus, setNewStatus] = useState('pending');
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appointment_date: '', notes: '' });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      setAll(data.appointments); setFiltered(data.appointments);
    } catch { toast('Мэдээлэл ачаалахад алдаа гарлаа.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = all;
    if (searchQ) list = list.filter(a => `${a.patient_first} ${a.patient_last} ${a.doctor_first} ${a.doctor_last}`.toLowerCase().includes(searchQ.toLowerCase()));
    if (statusFilter) list = list.filter(a => a.status === statusFilter);
    setFiltered(list);
  }, [searchQ, statusFilter, all]);

  const submitAdd = async () => {
    try {
      await api.post('/appointments', { ...form, patient_id: +form.patient_id, doctor_id: +form.doctor_id });
      toast('Цаг амжилттай захиалагдлаа!');
      setAddModal(false);
      setForm({ patient_id: '', doctor_id: '', appointment_date: '', notes: '' });
      load();
    } catch (e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  const openStatus = (id, status) => { setSelectedId(id); setNewStatus(status); setStatusModal(true); };

  const submitStatus = async () => {
    try {
      await api.put(`/appointments/${selectedId}/status`, { status: newStatus });
      toast('Статус шинэчлэгдлээ!');
      setStatusModal(false);
      load();
    } catch (e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  const cancel = async (id) => {
    if (!window.confirm('Энэ цагийг цуцлах уу?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast('Цаг цуцлагдлаа.');
      load();
    } catch (e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  return (
    <div className="fade-up">
      <PageHeader title={myOnly ? 'Миний цаг захиалгууд' : 'Цаг захиалга'} subtitle="Цаг захиалгын жагсаалт" />
      <SearchBar>
        <SearchInput placeholder="🔍  Хайх..." onChange={e => setSearchQ(e.target.value)} />
        <select
          style={{ padding: '.65rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontFamily: 'Manrope', fontSize: '.875rem', outline: 'none' }}
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Бүх статус</option>
          <option value="pending">Хүлээгдэж байна</option>
          <option value="confirmed">Баталгаажсан</option>
          <option value="completed">Дууссан</option>
          <option value="cancelled">Цуцлагдсан</option>
        </select>
        {!myOnly && <Btn onClick={() => setAddModal(true)}>＋ Цаг захиалах</Btn>}
      </SearchBar>

      <TableCard>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Өвчтөн</th><th>Эмч</th><th>Огноо</th><th>Статус</th><th>Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRow cols={5} /> : filtered.length === 0 ? <EmptyRow cols={5} msg="Цаг захиалга байхгүй" /> :
              filtered.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.patient_first} {a.patient_last}</strong></td>
                  <td>
                    {a.doctor_first} {a.doctor_last}
                    {a.specialization && <><br /><small style={{ color: 'var(--muted)' }}>{a.specialization}</small></>}
                  </td>
                  <td>{fmtDate(a.appointment_date)}</td>
                  <td><span className={`badge ${a.status}`}>{statusLabel(a.status)}</span></td>
                  <td>
                    <div className={styles.actions}>
                      {!myOnly && <Btn size="sm" variant="outline" onClick={() => openStatus(a.id, a.status)}>Статус</Btn>}
                      {a.status !== 'cancelled' && <Btn size="sm" variant="danger" onClick={() => cancel(a.id)}>Цуцлах</Btn>}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </TableCard>

      {/* Add appointment modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Цаг захиалах">
        <FormGrid>
          <Field label="Нэр"><Input value={form.notes} onChange={set('notes')} /></Field>
          <Field label="Овог"><Input value={form.notes} onChange={set('notes')} /></Field>
          <Field label="Огноо, цаг" ><Input type="datetime-local" value={form.appointment_date} onChange={set('appointment_date')} /></Field>
          <Field label="Тэмдэглэл"><Input value={form.notes} onChange={set('notes')} /></Field>
        </FormGrid>
        <ModalFooter>
          <Btn variant="outline" onClick={() => setAddModal(false)}>Болих</Btn>
          <Btn onClick={submitAdd}>Захиалах</Btn>
        </ModalFooter>
      </Modal>

      {/* Status modal */}
      <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Статус өөрчлөх">
        <Field label="Шинэ статус">
          <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            <option value="pending">Хүлээгдэж байна</option>
            <option value="confirmed">Баталгаажсан</option>
            <option value="completed">Дууссан</option>
            <option value="cancelled">Цуцлагдсан</option>
          </Select>
        </Field>
        <ModalFooter>
          <Btn variant="outline" onClick={() => setStatusModal(false)}>Болих</Btn>
          <Btn onClick={submitStatus}>Хадгалах</Btn>
        </ModalFooter>
      </Modal>
    </div>
  );
}
