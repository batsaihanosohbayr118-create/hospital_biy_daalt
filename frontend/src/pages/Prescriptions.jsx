import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import {
  PageHeader,
  SearchBar,
  Btn,
  TableCard,
  EmptyRow,
  LoadingRow,
  Field,
  Input,
  FormGrid,
  ModalFooter
} from '../components/UI';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';
import styles from './Table.module.css';

const fmtDate = d => d ? new Date(d).toLocaleDateString('mn-MN') : '-';
const esc = v => String(v ?? '-')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export default function Prescriptions({ selectedPatientId = null, selectedAppointmentId = null, selectedDoctorId = null, onGoRecords }) {
  const toast = useToast();
  const { user } = useAuth();
  const [patientId, setPatientId] = useState(selectedPatientId ? String(selectedPatientId) : '');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    appointment_id: selectedAppointmentId ? String(selectedAppointmentId) : '',
    doctor_id: selectedDoctorId ? String(selectedDoctorId) : '',
    patient_id: selectedPatientId ? String(selectedPatientId) : '',
    medication: '',
    dosage: '',
    duration: '',
    instructions: ''
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const load = useCallback(async (id = patientId) => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'patient'
        ? '/prescriptions/me'
        : id
          ? `/prescriptions/patient/${id}`
          : '/prescriptions';

      const { data } = await api.get(endpoint);
      setList(data.prescriptions || []);
    } catch (e) {
      toast(e.response?.data?.error || 'Жор ачаалахад алдаа гарлаа.', 'error');
    } finally {
      setLoading(false);
    }
  }, [patientId, toast, user?.role]);

  useEffect(() => {
    if (user?.role === 'patient') {
      load();
    } else if (selectedPatientId) {
      const id = String(selectedPatientId);
      setPatientId(id);
      setForm(f => ({
        ...f,
        patient_id: id,
        doctor_id: selectedDoctorId ? String(selectedDoctorId) : f.doctor_id,
        appointment_id: selectedAppointmentId ? String(selectedAppointmentId) : f.appointment_id
      }));
      load(id);
    } else {
      load('');
    }
  }, [load, selectedAppointmentId, selectedDoctorId, selectedPatientId, user?.role]);

  const openCreate = () => {
    setForm(f => ({
      ...f,
      patient_id: selectedPatientId ? String(selectedPatientId) : patientId,
      doctor_id: selectedDoctorId ? String(selectedDoctorId) : f.doctor_id,
      appointment_id: selectedAppointmentId ? String(selectedAppointmentId) : f.appointment_id
    }));
    setModal(true);
  };

  const submit = async () => {
    if (!form.appointment_id || !form.medication || !form.dosage || !form.duration) {
      return toast('Цаг захиалга, эм, тун, хугацааг бөглөнө үү.', 'error');
    }

    try {
      await api.post('/prescriptions', {
        ...form,
        appointment_id: +form.appointment_id,
        doctor_id: form.doctor_id ? +form.doctor_id : undefined,
        patient_id: form.patient_id ? +form.patient_id : undefined
      });
      toast('Жор амжилттай хадгалагдлаа.');
      setModal(false);
      setForm({
        appointment_id: selectedAppointmentId ? String(selectedAppointmentId) : '',
        doctor_id: selectedDoctorId ? String(selectedDoctorId) : '',
        patient_id: selectedPatientId ? String(selectedPatientId) : patientId,
        medication: '',
        dosage: '',
        duration: '',
        instructions: ''
      });
      load(patientId || form.patient_id);
    } catch (e) {
      toast(e.response?.data?.error || 'Жор хадгалахад алдаа гарлаа.', 'error');
    }
  };

  const printPrescription = (p) => {
    const patientName = `${p.patient_first || ''} ${p.patient_last || ''}`.trim() || '-';
    const doctorName = `${p.doctor_first || ''} ${p.doctor_last || ''}`.trim() || '-';
    const win = window.open('', '_blank', 'width=820,height=960');

    if (!win) {
      toast('Хэвлэх цонх нээгдсэнгүй. Browser popup зөвшөөрнө үү.', 'error');
      return;
    }

    win.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Жор #${esc(p.id)}</title>
          <style>
            @page { size: A4; margin: 18mm; }
            * { box-sizing: border-box; }
            body { margin: 0; color: #10243a; font-family: Arial, sans-serif; background: #fff; }
            .sheet { width: 100%; min-height: 100vh; padding: 8px; }
            .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #0fb7a7; padding-bottom: 18px; margin-bottom: 22px; }
            .brand { font-size: 26px; font-weight: 800; color: #052b67; margin: 0 0 4px; }
            .sub { color: #58758e; margin: 0; font-size: 13px; }
            .code { text-align: right; color: #58758e; font-size: 13px; line-height: 1.5; }
            h1 { margin: 0 0 20px; text-align: center; font-size: 28px; color: #10243a; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; margin-bottom: 22px; }
            .box { border: 1px solid #d6e6ef; border-radius: 10px; padding: 12px 14px; background: #f8fcfe; }
            .label { display: block; color: #58758e; font-size: 12px; font-weight: 700; margin-bottom: 6px; }
            .value { font-size: 16px; font-weight: 700; color: #10243a; }
            .medicine { border: 2px solid #d6e6ef; border-radius: 14px; overflow: hidden; margin: 20px 0 28px; }
            .medicineTitle { background: #eaf7fb; padding: 12px 16px; font-size: 17px; font-weight: 800; color: #052b67; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 13px 16px; text-align: left; border-top: 1px solid #d6e6ef; vertical-align: top; }
            th { width: 150px; color: #58758e; background: #fbfdfe; }
            .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 48px; }
            .line { border-top: 1px solid #10243a; padding-top: 8px; color: #58758e; font-size: 13px; }
            .footer { margin-top: 34px; color: #7b93a8; font-size: 12px; text-align: center; }
            @media print { .noPrint { display: none; } }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div>
                <p class="brand">Hospital Management System</p>
                <p class="sub">Эмнэлгийн эмийн жор</p>
              </div>
              <div class="code">
                Жорын дугаар: #${esc(p.id)}<br />
                Огноо: ${esc(fmtDate(p.issued_at))}
              </div>
            </div>
            <h1>Эмийн жор</h1>
            <div class="grid">
              <div class="box"><span class="label">Өвчтөн</span><span class="value">${esc(patientName)}</span></div>
              <div class="box"><span class="label">Эмч</span><span class="value">${esc(doctorName)}</span></div>
              <div class="box"><span class="label">Тасаг</span><span class="value">${esc(p.specialization)}</span></div>
              <div class="box"><span class="label">Цаг захиалгын ID</span><span class="value">${esc(p.appointment_id)}</span></div>
            </div>
            <div class="medicine">
              <div class="medicineTitle">Жорын мэдээлэл</div>
              <table>
                <tr><th>Эм</th><td>${esc(p.medication)}</td></tr>
                <tr><th>Тун</th><td>${esc(p.dosage)}</td></tr>
                <tr><th>Хугацаа</th><td>${esc(p.duration)}</td></tr>
                <tr><th>Заавар</th><td>${esc(p.instructions || '-')}</td></tr>
              </table>
            </div>
            <div class="sign">
              <div class="line">Эмчийн гарын үсэг</div>
              <div class="line">Өвчтөний гарын үсэг</div>
            </div>
            <p class="footer">Энэхүү хуудсыг хэвлэхдээ printer сонгох эсвэл Save as PDF сонголтоор PDF болгож хадгална.</p>
          </div>
          <script>
            window.onload = () => {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fade-up">
      <PageHeader
        title={user?.role === 'patient' ? 'Миний жор' : 'Жор'}
        subtitle={user?.role === 'patient' ? 'Танд бичигдсэн эмийн жорууд' : 'Өвчтөнд бичсэн эмийн жорууд'}
      />

      <SearchBar className={styles.prescriptionSearchBar}>
        {user?.role !== 'patient' && (
          <>
            <Input
              type="number"
              placeholder="Өвчтөний ID"
              value={patientId}
              onChange={e => {
                setPatientId(e.target.value);
                setForm(f => ({ ...f, patient_id: e.target.value }));
              }}
              onKeyDown={e => e.key === 'Enter' && load()}
              style={{ maxWidth: 220 }}
            />
            <Btn className={styles.prescriptionSearchBtn} variant="outline" onClick={() => load()}>Хайх</Btn>
            {onGoRecords && <Btn className={styles.prescriptionRecordBtn} variant="outline" onClick={onGoRecords}>Бичлэг</Btn>}
            <Btn className={styles.prescriptionWriteBtn} onClick={openCreate}>＋ Жор бичих</Btn>
          </>
        )}
      </SearchBar>

      <TableCard className={styles.prescriptionsTableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№</th>
              <th>Эм</th>
              <th>Тун</th>
              <th>Хугацаа</th>
              <th>Заавар</th>
              {user?.role !== 'patient' && <th>Өвчтөн</th>}
              <th>Эмч</th>
              <th>Тасаг</th>
              <th>Огноо</th>
              <th>Хэвлэх</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow cols={user?.role === 'patient' ? 9 : 10} />
            ) : list.length === 0 ? (
              <EmptyRow cols={user?.role === 'patient' ? 9 : 10} msg={user?.role === 'patient' ? 'Жор байхгүй байна' : 'Жор олдсонгүй'} />
            ) : list.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td><strong>{p.medication}</strong></td>
                <td>{p.dosage}</td>
                <td>{p.duration}</td>
                <td>{p.instructions || '-'}</td>
                {user?.role !== 'patient' && <td>{p.patient_first} {p.patient_last}</td>}
                <td>{p.doctor_first} {p.doctor_last}</td>
                <td>{p.specialization || '-'}</td>
                <td>{fmtDate(p.issued_at)}</td>
                <td>
                  <Btn size="sm" onClick={() => printPrescription(p)}>
                    Хэвлэх
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <div className={styles.prescriptionMobileList}>
        {loading ? (
          <div className={styles.prescriptionCard}>Ачаалж байна...</div>
        ) : list.length === 0 ? (
          <div className={styles.prescriptionCard}>{user?.role === 'patient' ? 'Жор байхгүй байна' : 'Жор олдсонгүй'}</div>
        ) : list.map((p, i) => (
          <div className={styles.prescriptionCard} key={p.id}>
            <div className={styles.prescriptionCardTop}>
              <span className={styles.patientNo}>#{i + 1}</span>
              <span>{fmtDate(p.issued_at)}</span>
            </div>
            <strong>{p.medication}</strong>
            <div className={styles.prescriptionCardMeta}>
              <span>{p.dosage}</span>
              <span>{p.duration}</span>
            </div>
            <p>{p.instructions || 'Заавар —'}</p>
            <div className={styles.prescriptionPeople}>
              {user?.role !== 'patient' && <span>Өвчтөн: {p.patient_first} {p.patient_last}</span>}
              <span>Эмч: {p.doctor_first} {p.doctor_last}</span>
              <span>Тасаг: {p.specialization || '-'}</span>
            </div>
            <Btn size="sm" onClick={() => printPrescription(p)}>
              Хэвлэх
            </Btn>
          </div>
        ))}
      </div>

      {user?.role !== 'patient' && (
        <Modal open={modal} onClose={() => setModal(false)} title="Жор бичих">
          <FormGrid>
            <Field label="Цаг захиалгын ID">
              <Input value={form.appointment_id} onChange={set('appointment_id')} type="number" />
            </Field>
            <Field label="Өвчтөний ID">
              <Input value={form.patient_id} onChange={set('patient_id')} type="number" placeholder="Цаг захиалгаас автоматаар авна" />
            </Field>
            <Field label="Эм">
              <Input value={form.medication} onChange={set('medication')} placeholder="Парацетамол" />
            </Field>
            <Field label="Тун">
              <Input value={form.dosage} onChange={set('dosage')} placeholder="500мг" />
            </Field>
            <Field label="Хугацаа">
              <Input value={form.duration} onChange={set('duration')} placeholder="5 хоног" />
            </Field>
            <Field label="Заавар">
              <Input value={form.instructions} onChange={set('instructions')} placeholder="Өдөрт 2 удаа" />
            </Field>
          </FormGrid>
          <ModalFooter>
            <Btn variant="outline" onClick={() => setModal(false)}>Болих</Btn>
            <Btn onClick={submit}>Хадгалах</Btn>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
