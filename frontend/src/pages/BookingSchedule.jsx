import { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { PageHeader, TableCard, Btn, Field, Input, FormGrid } from '../components/UI';
import { useToast } from '../ToastContext';
import styles from './BookingFlow.module.css';

const timeSlots = [
  '08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00',
  '15:30','16:00','16:30','17:00'
];

export default function BookingSchedule({ department, doctor, onBack, onDone }) {
  const toast = useToast();
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('08:30');
  const [notes, setNotes] = useState('');
  const [takenTimes, setTakenTimes] = useState([]);

  const loadTaken = useCallback(async () => {
    if (!doctor?.id || !visitDate) { setTakenTimes([]); return; }
    try {
      const { data } = await api.get(`/appointments/doctor/${doctor.id}`, { params: { date: visitDate } });
      setTakenTimes(data.times || []);
    } catch {
      setTakenTimes([]);
    }
  }, [doctor?.id, visitDate]);

  useEffect(() => { loadTaken(); }, [loadTaken]);

  const submit = async () => {
    if (!doctor?.id) return toast('Эмч сонгоно уу.', 'error');
    if (!visitDate || !visitTime) return toast('Огноо, цаг сонгоно уу.', 'error');
    if (takenTimes.includes(visitTime)) return toast('Энэ цаг аль хэдийн захиалагдсан байна.', 'error');
    const d = new Date(`${visitDate}T${visitTime}:00`);
    const day = d.getDay();
    if (day === 0 || day === 6) return toast('Амралтын өдөр сонгож болохгүй.', 'error');

    try {
      const appointment_date = `${visitDate}T${visitTime}:00`;
      await api.post('/appointments', { doctor_id: +doctor.id, appointment_date, notes });
      toast('Цаг амжилттай захиалагдлаа!');
      onDone();
    } catch (e) {
      toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error');
    }
  };

  return (
    <div className="fade-up">
      <PageHeader title="Цаг Сонгох" subtitle={`${department || ''} • ${doctor ? `${doctor.first_name} ${doctor.last_name}` : ''}${doctor?.room_number ? ` • Өрөө: ${doctor.room_number}` : ''}`}>
        <Btn variant="outline" onClick={onBack}>Буцах</Btn>
      </PageHeader>

      <TableCard>
        <FormGrid>
          <Field label="Огноо">
            <Input
              type="date"
              value={visitDate}
              min={new Date().toISOString().slice(0,10)}
              onChange={e => {
                const v = e.target.value;
                if (!v) return setVisitDate('');
                const day = new Date(v + 'T00:00:00').getDay();
                if (day === 0 || day === 6) {
                  toast('Амралтын өдөр сонгож болохгүй.', 'error');
                  return;
                }
                setVisitDate(v);
              }}
            />
          </Field>
          <Field label="Цаг (30 минут)">
            <div className={styles.timeGrid}>
              {timeSlots.map(t => {
                const taken = takenTimes.includes(t);
                const selected = visitTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.timeSlot} ${selected ? styles.timeSlotActive : ''} ${taken ? styles.timeSlotTaken : ''}`}
                    aria-disabled={taken || !doctor?.id || !visitDate}
                    onClick={() => {
                      if (!doctor?.id || !visitDate) return toast('Эхлээд огноо сонгоно уу.', 'error');
                      if (taken) return toast('Энэ цаг аль хэдийн захиалагдсан байна.', 'error');
                      setVisitTime(t);
                    }}
                    title={taken ? 'Энэ цаг аль хэдийн захиалагдсан байна' : 'Сонгох боломжтой'}
                  >
                    <span>{t}</span>
                    {taken && <small>Дүүрсэн</small>}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Тэмдэглэл">
            <Input value={notes} onChange={e => setNotes(e.target.value)} />
          </Field>
        </FormGrid>

        <div className={styles.footer}>
          <Btn variant="outline" onClick={onBack}>Буцах</Btn>
          <Btn onClick={submit}>Цаг Захиалах</Btn>
        </div>
      </TableCard>
    </div>
  );
}
