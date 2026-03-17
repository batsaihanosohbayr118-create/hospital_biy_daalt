import { query } from '../config/database.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await query(`
      SELECT d.id, d.first_name, d.last_name, d.specialization,
             d.phone, d.available_days, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.specialization
    `);
    res.json({ total: doctors.length, doctors });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctors = await query(`
      SELECT d.*, u.email
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `, [id]);

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Эмч олдсонгүй.' });
    }

    const appointments = await query(`
      SELECT a.id, a.appointment_date, a.status,
             p.first_name, p.last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = ? AND a.appointment_date >= NOW()
      ORDER BY a.appointment_date
      LIMIT 10
    `, [id]);

    res.json({ ...doctors[0], upcoming_appointments: appointments });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { user_id, first_name, last_name, specialization, phone, license_number, available_days } = req.body;

    const result = await query(`
      INSERT INTO doctors (user_id, first_name, last_name, specialization, phone, license_number, available_days)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user_id, first_name, last_name, specialization, phone, license_number, available_days]);

    res.status(201).json({ message: 'Эмч амжилттай бүртгэгдлээ.', doctorId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const appointments = await query(`
      SELECT a.id, a.appointment_date, a.status, a.notes,
             p.first_name AS patient_first, p.last_name AS patient_last,
             p.phone AS patient_phone
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC
    `, [id]);

    res.json({ total: appointments.length, appointments });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};