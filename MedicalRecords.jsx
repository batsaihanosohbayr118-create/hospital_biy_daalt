import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import { useToast } from '../ToastContext';
import { useAuth } from '../AuthContext';

const inp = { width:'100%', padding:'.55rem 1rem', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)', fontFamily:'Manrope,sans-serif', fontSize:'.875rem', outline:'none' };
const lbl = { display:'block', fontSize:'.78rem', color:'var(--muted)', fontWeight:600, marginBottom:'.4rem' };
const thStyle = { textAlign:'left', padding:'.75rem 1.5rem', fontSize:'.72rem', color:'var(--muted)', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1px solid var(--border)' };
const tdStyle = { padding:'.9rem 1.5rem', fontSize:'.875rem', borderBottom:'1px solid rgba(28,45,71,.5)' };

export default function MedicalRecords() {
  const toast = useToast();
  const { user } = useAuth();
  const [patientId, setPatientId] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ patient_id:'', doctor_id:'', diagnosis:'', treatment:'', test_results:'', record_date:'', is_confidential: false });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const search = async (id) => {
    const pid = id || patientId;
    if (!pid) return toast('Өвчтөний ID оруулна уу.', 'error');
    setLoading(true);
    try {
      const { data } = await api.get(`/medical-records/patient/${pid}`);
      setList(data.records);
    } catch(e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
    finally { setLoading(false); }
  };

  // Өвчтөн нэвтэрсэн бол автоматаар өөрийн бичлэгийг харуулна
  useEffect(() => {
    if (user?.role === 'patient' && user?.id) {
      setPatientId(String(user.id));
      search(String(user.id));
    }
  }, [user]);

  const submit = async () => {
    try {
      await api.post('/medical-records', {
        ...form,
        patient_id: +form.patient_id,
        doctor_id: +form.doctor_id,
        is_confidential: form.is_confidential === 'true' || form.is_confidential === true
      });
      toast('Эмнэлгийн бичлэг хадгалагдлаа!');
      setModal(false);
      setForm({ patient_id:'', doctor_id:'', diagnosis:'', treatment:'', test_results:'', record_date:'', is_confidential: false });
      if (patientId) search();
    } catch(e) { toast(e.response?.data?.error || 'Алдаа гарлаа.', 'error'); }
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:'2rem' }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem' }}>
          {user?.role === 'patient' ? 'Миний эмнэлгийн бичлэг' : 'Эмнэлгийн бичлэг'}
        </h2>
        <p style={{ color:'var(--muted)', fontSize:'.875rem', marginTop:'.3rem' }}>Өвчтөний эмнэлгийн түүх</p>
      </div>

      <div style={{ display:'flex', gap:'.75rem', marginBottom:'1.5rem' }}>
        {/* Хайлт зөвхөн admin/doctor-д */}
        {user?.role !== 'patient' && (
          <>
            <input
              style={{ ...inp, maxWidth:220 }}
              type="number"
              placeholder="Өвчтөний ID..."
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
            <button onClick={() => search()} style={{ padding:'.65rem 1.2rem', background:'rgba(59,158,255,.15)', border:'none', borderRadius:10, color:'var(--accent2)', fontWeight:700, cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>
              🔍 Хайх
            </button>
          </>
        )}

        {/* Бичлэг нэмэх зөвхөн doctor/admin-д */}
        {user?.role !== 'patient' && (
          <button onClick={() => setModal(true)} style={{ padding:'.65rem 1.2rem', background:'rgba(0,212,170,.15)', border:'none', borderRadius:10, color:'var(--accent)', fontWeight:700, cursor:'pointer', fontFamily:'Manrope,sans-serif', marginLeft:'auto' }}>
            ＋ Бичлэг нэмэх
          </button>
        )}
      </div>

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['Оношлогоо','Эмчилгээ','Эмч','Огноо','Нууц'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem' }}><span className="spinner"/></td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--muted)' }}>
                {user?.role === 'patient' ? 'Эмнэлгийн бичлэг байхгүй байна' : patientId ? 'Бичлэг олдсонгүй' : 'Өвчтөний ID оруулж хайна уу'}
              </td></tr>
            ) : list.map(r => (
              <tr key={r.id}>
                <td style={tdStyle}><strong>{r.diagnosis}</strong></td>
                <td style={tdStyle}>{r.treatment || '—'}</td>
                <td style={tdStyle}>{r.doctor_first} {r.doctor_last}</td>
                <td style={tdStyle}>{r.record_date ? new Date(r.record_date).toLocaleDateString('mn-MN') : '—'}</td>
                <td style={tdStyle}>
                  <span className={`badge ${r.is_confidential ? 'cancelled' : 'confirmed'}`}>
                    {r.is_confidential ? '🔒 Тийм' : '🔓 Үгүй'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Бичлэг нэмэх modal - зөвхөн doctor/admin */}
      {user?.role !== 'patient' && (
        <Modal open={modal} onClose={() => setModal(false)} title="Эмнэлгийн бичлэг нэмэх">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
            <div style={{ marginBottom:'.75rem' }}>
              <label style={lbl}>Өвчтөн ID</label>
              <input style={inp} type="number" placeholder="1" value={form.patient_id} onChange={set('patient_id')} />
            </div>
            <div style={{ marginBottom:'.75rem' }}>
              <label style={lbl}>Эмч ID</label>
              <input style={inp} type="number" placeholder="1" value={form.doctor_id} onChange={set('doctor_id')} />
            </div>
            <div style={{ marginBottom:'.75rem', gridColumn:'1/-1' }}>
              <label style={lbl}>Оношлогоо</label>
              <input style={inp} placeholder="Томуу, Хүйтэн..." value={form.diagnosis} onChange={set('diagnosis')} />
            </div>
            <div style={{ marginBottom:'.75rem', gridColumn:'1/-1' }}>
              <label style={lbl}>Эмчилгээ</label>
              <input style={inp} placeholder="Амралт, эм уух..." value={form.treatment} onChange={set('treatment')} />
            </div>
            <div style={{ marginBottom:'.75rem', gridColumn:'1/-1' }}>
              <label style={lbl}>Шинжилгээний үр дүн</label>
              <input style={inp} placeholder="Цусны шинжилгээ хэвийн..." value={form.test_results} onChange={set('test_results')} />
            </div>
            <div style={{ marginBottom:'.75rem' }}>
              <label style={lbl}>Огноо</label>
              <input style={inp} type="date" value={form.record_date} onChange={set('record_date')} />
            </div>
            <div style={{ marginBottom:'.75rem' }}>
              <label style={lbl}>Нууц эсэх</label>
              <select style={inp} value={form.is_confidential} onChange={set('is_confidential')}>
                <option value={false}>Үгүй</option>
                <option value={true}>Тийм</option>
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
            <button onClick={() => setModal(false)} style={{ padding:'.55rem 1.1rem', background:'none', border:'1px solid var(--border)', borderRadius:9, color:'var(--muted)', cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Болих</button>
            <button onClick={submit} style={{ padding:'.55rem 1.1rem', background:'rgba(0,212,170,.15)', border:'none', borderRadius:9, color:'var(--accent)', fontWeight:700, cursor:'pointer', fontFamily:'Manrope,sans-serif' }}>Хадгалах</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
