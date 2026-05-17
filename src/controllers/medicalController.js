import { query } from '../config/database.js';

export const createPrescription = async (req, res) => {
  try {
    let { appointment_id, doctor_id, patient_id, medication, dosage, duration, instructions } = req.body;

    if (!appointment_id) {
      return res.status(400).json({ error: 'Цаг захиалгын ID заавал.' });
    }

    const appointments = await query(
      'SELECT id, doctor_id, patient_id FROM Appointment WHERE id = ? LIMIT 1',
      [appointment_id]
    );
    if (appointments.length === 0) {
      return res.status(400).json({ error: 'Ийм цаг захиалга олдсонгүй.' });
    }

    const appointment = appointments[0];

    if (!doctor_id && req.user?.role === 'doctor') {
      const rows = await query('SELECT id FROM Doctor WHERE user_id = ? LIMIT 1', [req.user.id]);
      if (rows.length === 0) {
        return res.status(400).json({ error: 'Эмчийн профайл үүсээгүй байна.' });
      }
      doctor_id = rows[0].id;
    }

    if (req.user?.role === 'doctor' && Number(doctor_id) !== Number(appointment.doctor_id)) {
      return res.status(403).json({ error: 'Зөвхөн өөрийн цаг захиалгад жор бичнэ.' });
    }

    doctor_id = appointment.doctor_id;
    patient_id = appointment.patient_id;

    if (!doctor_id || !patient_id || !medication || !dosage || !duration) {
      return res.status(400).json({ error: 'Эм, тун, хугацаа заавал.' });
    }

    const result = await query(`
      INSERT INTO Prescription (appointment_id, doctor_id, patient_id, medication, dosage, duration, instructions)
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

    const prescriptions = await query(`
      SELECT pr.*, d.first_name AS doctor_first, d.last_name AS doctor_last,
             d.specialization, p.id AS patient_id, p.first_name AS patient_first,
             p.last_name AS patient_last
      FROM Prescription pr
      JOIN Doctor d ON pr.doctor_id = d.id
      JOIN Patient p ON pr.patient_id = p.id
      WHERE pr.patient_id = ?
      ORDER BY pr.issued_at DESC
    `, [patientId]);

    res.json({ total: prescriptions.length, prescriptions });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getAllPrescriptions = async (req, res) => {
  try {
    let doctorFilter = '';
    const params = [];

    if (req.user?.role === 'doctor') {
      doctorFilter = 'WHERE d.user_id = ?';
      params.push(req.user.id);
    }

    const prescriptions = await query(`
      SELECT pr.*, d.first_name AS doctor_first, d.last_name AS doctor_last,
             d.specialization, p.id AS patient_id, p.first_name AS patient_first,
             p.last_name AS patient_last
      FROM Prescription pr
      JOIN Doctor d ON pr.doctor_id = d.id
      JOIN Patient p ON pr.patient_id = p.id
      ${doctorFilter}
      ORDER BY pr.issued_at DESC
    `, params);

    res.json({ total: prescriptions.length, prescriptions });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getMyPrescriptions = async (req, res) => {
  try {
    const patients = await query('SELECT id FROM Patient WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (patients.length === 0) {
      return res.json({ total: 0, prescriptions: [] });
    }

    const prescriptions = await query(`
      SELECT pr.*, d.first_name AS doctor_first, d.last_name AS doctor_last,
             d.specialization, p.id AS patient_id, p.first_name AS patient_first,
             p.last_name AS patient_last
      FROM Prescription pr
      JOIN Doctor d ON pr.doctor_id = d.id
      JOIN Patient p ON pr.patient_id = p.id
      WHERE pr.patient_id = ?
      ORDER BY pr.issued_at DESC
    `, [patients[0].id]);

    res.json({ total: prescriptions.length, prescriptions });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const createMedicalRecord = async (req, res) => {
  try {
    const { patient_id, doctor_id, diagnosis, treatment, test_results, record_date, is_confidential } = req.body;

    const result = await query(`
      INSERT INTO MedicalRecord (patient_id, doctor_id, diagnosis, treatment, test_results, record_date, is_confidential)
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
      SELECT mr.id,
             mr.diagnosis,
             mr.treatment,
             mr.test_results,
             mr.record_date,
             mr.is_confidential,
             p.first_name AS patient_first,
             p.last_name AS patient_last,
             p.registry_number AS registry_number,
             d.first_name AS doctor_first,
             d.last_name AS doctor_last
      FROM MedicalRecord mr
      JOIN Doctor d ON mr.doctor_id = d.id
      JOIN Patient p ON mr.patient_id = p.id
      WHERE mr.patient_id = ?
    `;

    if (role === 'patient') {
      sql += ' AND mr.is_confidential = FALSE';
    }

    sql += ' ORDER BY mr.record_date DESC';

    const records = await query(sql, [patientId]);

    const formatted = records.map(r => ({
      ...r,
      status: r.is_confidential ? 'Нууц' : 'Ил',
      report_status: r.is_confidential ? 'Нууц' : 'Ил',
      final_diagnosis: r.treatment || r.diagnosis || '',
      symptom: r.treatment || '',
      tests: r.test_results || '',
      patient_name: `${r.patient_first || ''} ${r.patient_last || ''}`.trim()
    }));

    res.json({ total: formatted.length, records: formatted });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};
