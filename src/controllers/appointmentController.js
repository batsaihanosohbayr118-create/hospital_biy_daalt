import { query } from '../config/database.js';

export const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, notes } = req.body;
    const conflict = await query(`
      SELECT id FROM appointments
      WHERE doctor_id = ? AND appointment_date = ? AND status != 'cancelled'
    `, [doctor_id, appointment_date]);

    if (conflict.length > 0) {
      return res.status(409).json({ error: 'Тухайн цагт эмч завгүй байна.' });
    }

    const result = await query(`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, notes)
      VALUES (?, ?, ?, ?)
    `, [patient_id, doctor_id, appointment_date, notes]);

    res.status(201).json({
      message: 'Цаг амжилттай захиалагдлаа.',
      appointmentId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { status, date } = req.query;
    let sql = `
      SELECT a.id, a.appointment_date, a.status, a.notes,
             p.first_name AS patient_first, p.last_name AS patient_last,
             d.first_name AS doctor_first, d.last_name AS doctor_last,
             d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { sql += ' AND a.status = ?'; params.push(status); }
    if (date)   { sql += ' AND DATE(a.appointment_date) = ?'; params.push(date); }

    sql += ' ORDER BY a.appointment_date DESC';

    const appointments = await query(sql, params);
    res.json({ total: appointments.length, appointments });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Буруу статус.' });
    }

    await query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Цагийн статус "${status}" болж өөрчлөгдлөө.` });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE appointments SET status = "cancelled" WHERE id = ?', [id]);
    res.json({ message: 'Цаг цуцлагдлаа.' });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};