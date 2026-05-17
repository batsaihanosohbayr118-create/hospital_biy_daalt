import { query } from '../config/database.js';

const firstCount = (rows) => Number(rows?.[0]?.count || 0);

export const getDashboardStats = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.id;

    let patientFilter = '';
    let appointmentFilter = '';
    let prescriptionFilter = '';
    const params = [];

    if (role === 'doctor') {
      const doctors = await query('SELECT id FROM Doctor WHERE user_id = ? LIMIT 1', [userId]);
      const doctorId = doctors[0]?.id;
      if (!doctorId) {
        return res.json({
          stats: { patients: 0, doctors: 0, todayAppointments: 0, pendingAppointments: 0 },
          recentAppointments: [],
          recentPrescriptions: []
        });
      }
      patientFilter = 'JOIN Appointment a2 ON a2.patient_id = p.id WHERE a2.doctor_id = ?';
      appointmentFilter = 'AND a.doctor_id = ?';
      prescriptionFilter = 'AND pr.doctor_id = ?';
      params.push(doctorId);
    }

    if (role === 'patient') {
      const patients = await query('SELECT id FROM Patient WHERE user_id = ? LIMIT 1', [userId]);
      const patientId = patients[0]?.id;
      if (!patientId) {
        return res.json({
          stats: { patients: 0, doctors: 0, todayAppointments: 0, pendingAppointments: 0 },
          recentAppointments: [],
          recentPrescriptions: []
        });
      }
      appointmentFilter = 'AND a.patient_id = ?';
      prescriptionFilter = 'AND pr.patient_id = ?';
      params.push(patientId);
    }

    const patientSql = role === 'doctor'
      ? `SELECT COUNT(DISTINCT p.id) AS count FROM Patient p ${patientFilter}`
      : 'SELECT COUNT(*) AS count FROM Patient';

    const doctorSql = role === 'patient'
      ? `SELECT COUNT(DISTINCT d.id) AS count
         FROM Doctor d
         JOIN Appointment a ON a.doctor_id = d.id
         WHERE a.patient_id = ?`
      : 'SELECT COUNT(*) AS count FROM Doctor';

    const patientParams = role === 'doctor' ? [params[0]] : [];
    const doctorParams = role === 'patient' ? [params[0]] : [];
    const appointmentParams = params.length ? [params[0]] : [];

    const [
      patientRows,
      doctorRows,
      todayRows,
      pendingRows,
      recentAppointments,
      recentPrescriptions
    ] = await Promise.all([
      query(patientSql, patientParams),
      query(doctorSql, doctorParams),
      query(`
        SELECT COUNT(*) AS count
        FROM Appointment a
        WHERE DATE(a.appointment_date) = CURDATE()
        ${appointmentFilter}
      `, appointmentParams),
      query(`
        SELECT COUNT(*) AS count
        FROM Appointment a
        WHERE a.status = 'pending'
        ${appointmentFilter}
      `, appointmentParams),
      query(`
        SELECT a.id, a.appointment_date, a.status, a.notes,
               p.id AS patient_id, p.first_name AS patient_first, p.last_name AS patient_last, p.phone AS patient_phone,
               d.id AS doctor_id, d.first_name AS doctor_first, d.last_name AS doctor_last, d.room_number,
               d.specialization
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.id
        JOIN Doctor d ON a.doctor_id = d.id
        WHERE 1=1
        ${appointmentFilter}
        ORDER BY a.appointment_date DESC
        LIMIT 8
      `, appointmentParams),
      query(`
        SELECT pr.id, pr.medication, pr.dosage, pr.duration, pr.instructions, pr.issued_at,
               p.first_name AS patient_first, p.last_name AS patient_last,
               d.first_name AS doctor_first, d.last_name AS doctor_last, d.specialization
        FROM Prescription pr
        JOIN Patient p ON pr.patient_id = p.id
        JOIN Doctor d ON pr.doctor_id = d.id
        WHERE 1=1
        ${prescriptionFilter}
        ORDER BY pr.issued_at DESC
        LIMIT 6
      `, appointmentParams)
    ]);

    res.json({
      stats: {
        patients: firstCount(patientRows),
        doctors: firstCount(doctorRows),
        todayAppointments: firstCount(todayRows),
        pendingAppointments: firstCount(pendingRows)
      },
      recentAppointments,
      recentPrescriptions
    });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};
