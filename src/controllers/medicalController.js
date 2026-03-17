import { query } from '../config/database.js';

export const createPrescription = async (req, res) => {
  try {
    const { appointment_id, doctor_id, patient_id, medication, dosage, duration, instructions } = req.body;

    const result = await query(`
      INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medication, dosage, duration, instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [appointment_id, doctor_id, patient_id, medication, dosage, duration, instructions]);

    res.status(201).json({ message: 'Жор амжилттай бичигдлээ.', prescriptionId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (req.user.role === 'patient' && req.user.patientId !== parseInt(patientId)) {
      return res.status(403).json({ error: 'Зөвшөөрөлгүй.' });
    }

    const prescriptions = await query(`
      SELECT pr.*, d.first_name AS doctor_first, d.last_name AS doctor_last,
             d.specialization
      FROM prescriptions pr
      JOIN doctors d ON pr.doctor_id = d.id
      WHERE pr.patient_id = ?
      ORDER BY pr.issued_at DESC
    `, [patientId]);

    res.json({ total: prescriptions.length, prescriptions });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    const { patient_id, doctor_id, diagnosis, treatment, test_results, record_date, is_confidential } = req.body;

    const result = await query(`
      INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment, test_results, record_date, is_confidential)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [patient_id, doctor_id, diagnosis, treatment, test_results, record_date, is_confidential || false]);

    res.status(201).json({ message: 'Эмнэлгийн бичлэг амжилттай хадгалагдлаа.', recordId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { role } = req.user;

    let sql = `
      SELECT mr.id, mr.diagnosis, mr.treatment, mr.record_date, mr.is_confidential,
             d.first_name AS doctor_first, d.last_name AS doctor_last
      FROM medical_records mr
      JOIN doctors d ON mr.doctor_id = d.id
      WHERE mr.patient_id = ?
    `;

    if (role === 'patient') {
      sql += ' AND mr.is_confidential = FALSE';
    }

    sql += ' ORDER BY mr.record_date DESC';

    const records = await query(sql, [patientId]);
    res.json({ total: records.length, records });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};