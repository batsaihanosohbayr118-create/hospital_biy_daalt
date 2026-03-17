import { query } from '../config/database.js';

export const getAllPatients = async (req, res) => {
  try {
    const patients = await query(`
      SELECT p.id, p.first_name, p.last_name, p.date_of_birth,
             p.gender, p.phone, p.blood_type, u.email
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json({ total: patients.length, patients });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role === 'patient') {
      const patientCheck = await query(
        'SELECT id FROM patients WHERE id = ? AND user_id = ?',
        [id, req.user.id]
      );
      if (patientCheck.length === 0) {
        return res.status(403).json({ error: 'Зөвшөөрөлгүй.' });
      }
    }

    const patients = await query(`
      SELECT p.*, u.email
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Өвчтөн олдсонгүй.' });
    }

    res.json(patients[0]);
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { user_id, first_name, last_name, date_of_birth, gender, phone, address, blood_type } = req.body;

    const result = await query(`
      INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, phone, address, blood_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [user_id, first_name, last_name, date_of_birth, gender, phone, address, blood_type]);

    res.status(201).json({ message: 'Өвчтөн амжилттай бүртгэгдлээ.', patientId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, address, blood_type } = req.body;

    await query(`
      UPDATE patients SET first_name=?, last_name=?, phone=?, address=?, blood_type=?
      WHERE id=?
    `, [first_name, last_name, phone, address, blood_type, id]);

    res.json({ message: 'Өвчтөний мэдээлэл шинэчлэгдлээ.' });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};