import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

const DEFAULT_DEPARTMENTS = [
  'Дотор',
  'Хүүхэд',
  'Мэс засал',
  'Эмэгтэйчүүд',
  'Мэдрэл',
  'Зүрх судас',
  'Шүд',
  'Нүд',
  'Чих хамар хоолой',
  'Яаралтай тусламж'
];

const ensureDepartmentsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS departments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const doctorRows = await query(`
    SELECT DISTINCT specialization
    FROM Doctor
    WHERE specialization IS NOT NULL AND specialization <> ''
  `);
  const departments = [...new Set([...DEFAULT_DEPARTMENTS, ...doctorRows.map(r => r.specialization)])];

  for (const name of departments) {
    await query('INSERT IGNORE INTO departments (name) VALUES (?)', [name]);
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await query(`
      SELECT d.id, d.user_id, d.first_name, d.last_name, d.specialization,
             d.phone, d.room_number, d.position_title,
             d.available_days, d.license_number, d.profile_image_url,
             d.experience_years, u.email
      FROM Doctor d
      JOIN User u ON d.user_id = u.id
      ORDER BY d.specialization
    `);
    res.json({ total: doctors.length, doctors });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getMyDoctorProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Нэвтэрнэ үү.' });
    }

    const userRows = await query('SELECT email FROM User WHERE id = ? LIMIT 1', [userId]);
    const email = userRows[0]?.email || null;

    const rows = await query(`
      SELECT d.id, d.user_id, d.first_name, d.last_name, d.specialization,
             d.phone, d.room_number, d.position_title,
             d.available_days, d.license_number, d.profile_image_url,
             d.experience_years
      FROM Doctor d
      WHERE d.user_id = ?
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      return res.json({ profile: null, email });
    }

    res.json({ profile: rows[0], email });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updateMyDoctorProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Нэвтэрнэ үү.' });
    }

    const {
      first_name,
      last_name,
      specialization,
      phone,
      room_number,
      position_title,
      license_number,
      available_days,
      profile_image_url,
      experience_years
    } = req.body;

    if (!first_name || !last_name || !specialization) {
      return res.status(400).json({ error: 'Нэр, овог, тасаг заавал.' });
    }

    const normalizedRoom = room_number === '' ? null : room_number;
    const normalizedTitle = position_title === '' ? null : position_title;
    const requestedLicense = license_number || null;
    const existing = await query('SELECT * FROM Doctor WHERE user_id = ? LIMIT 1', [userId]);

    if (existing.length === 0) {
      const result = await query(`
        INSERT INTO Doctor (user_id, first_name, last_name, specialization, phone, room_number, position_title, license_number, available_days, profile_image_url, experience_years)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        first_name,
        last_name,
        specialization,
        phone || null,
        normalizedRoom,
        normalizedTitle,
        requestedLicense || `LIC-${userId}-${Date.now()}`,
        available_days || null,
        profile_image_url || null,
        experience_years || null
      ]);

      const created = await query('SELECT * FROM Doctor WHERE id = ? LIMIT 1', [result.insertId]);
      return res.status(201).json({ message: 'Эмчийн профайл үүсгэлээ.', profile: created[0] });
    }

    const current = existing[0];
    await query(`
      UPDATE Doctor
      SET first_name = ?, last_name = ?, specialization = ?, phone = ?, room_number = ?, position_title = ?, license_number = ?, available_days = ?, profile_image_url = ?, experience_years = ?
      WHERE user_id = ?
    `, [
      first_name ?? current.first_name,
      last_name ?? current.last_name,
      specialization ?? current.specialization,
      phone ?? current.phone,
      room_number === undefined ? current.room_number : normalizedRoom,
      position_title === undefined ? current.position_title : normalizedTitle,
      requestedLicense || current.license_number,
      available_days ?? current.available_days,
      profile_image_url ?? current.profile_image_url,
      experience_years ?? current.experience_years,
      userId
    ]);

    const updated = await query('SELECT * FROM Doctor WHERE user_id = ? LIMIT 1', [userId]);
    res.json({ message: 'Эмчийн профайл шинэчлэгдлээ.', profile: updated[0] });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    await ensureDepartmentsTable();
    const rows = await query(`SELECT name FROM departments ORDER BY name`);
    const departments = rows.map(r => r.name);
    res.json({ total: departments.length, departments });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    await ensureDepartmentsTable();
    const name = String(req.body?.name || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'Тасгийн нэр заавал.' });
    }

    await query('INSERT INTO departments (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Тасаг нэмэгдлээ.', department: name });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ийм нэртэй тасаг байна.' });
    }
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    await ensureDepartmentsTable();
    const currentName = decodeURIComponent(req.params.name || '').trim();
    const nextName = String(req.body?.name || '').trim();
    if (!currentName || !nextName) {
      return res.status(400).json({ error: 'Тасгийн нэр заавал.' });
    }

    const existing = await query('SELECT name FROM departments WHERE name = ? LIMIT 1', [currentName]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Тасаг олдсонгүй.' });
    }

    await query('UPDATE departments SET name = ? WHERE name = ?', [nextName, currentName]);
    await query('UPDATE Doctor SET specialization = ? WHERE specialization = ?', [nextName, currentName]);
    res.json({ message: 'Тасаг шинэчлэгдлээ.', department: nextName });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ийм нэртэй тасаг байна.' });
    }
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await ensureDepartmentsTable();
    const name = decodeURIComponent(req.params.name || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'Тасгийн нэр заавал.' });
    }

    const doctors = await query('SELECT COUNT(*) AS total FROM Doctor WHERE specialization = ?', [name]);
    if (Number(doctors[0]?.total || 0) > 0) {
      return res.status(400).json({ error: 'Энэ тасагт эмч бүртгэлтэй тул устгах боломжгүй.' });
    }

    const result = await query('DELETE FROM departments WHERE name = ?', [name]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Тасаг олдсонгүй.' });
    }
    res.json({ message: 'Тасаг устгагдлаа.' });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctors = await query(`
      SELECT d.*, u.email
      FROM Doctor d
      JOIN User u ON d.user_id = u.id
      WHERE d.id = ?
    `, [id]);

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'Эмч олдсонгүй.' });
    }

    const appointments = await query(`
      SELECT a.id, a.appointment_date, a.status,
             p.first_name, p.last_name
      FROM Appointment a
      JOIN Patient p ON a.patient_id = p.id
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
    const {
      email,
      password,
      first_name,
      last_name,
      specialization,
      phone,
      room_number,
      position_title,
      license_number,
      available_days,
      profile_image_url,
      experience_years
    } = req.body;
    const normalizedSpecialization = specialization || 'Дотор';
    const normalizedRoom = room_number === '' ? null : room_number;
    const normalizedTitle = position_title === '' ? null : position_title;

    if (!email) {
      return res.status(400).json({ error: 'Имэйл заавал.' });
    }

    const existing = await query('SELECT id FROM User WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Энэ имэйл бүртгэлтэй байна.' });
    }

    let lic = license_number;
    if (!lic) {
      lic = `LIC-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    }

    const tempPassword = password && String(password).length > 0
      ? String(password)
      : `Doc${Math.random().toString(36).slice(2,6)}!${Math.floor(Math.random() * 90 + 10)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const userRes = await query(
      'INSERT INTO User (email, password, role, must_change_password) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, 'doctor', true]
    );

    let result;
    try {
      result = await query(`
        INSERT INTO Doctor (user_id, first_name, last_name, specialization, phone, room_number, position_title, license_number, available_days, profile_image_url, experience_years)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userRes.insertId,
        first_name,
        last_name,
        normalizedSpecialization,
        phone,
        normalizedRoom,
        normalizedTitle,
        lic,
        available_days || null,
        profile_image_url || null,
        experience_years || null
      ]);
    } catch (e) {
      await query('DELETE FROM User WHERE id = ?', [userRes.insertId]);
      throw e;
    }

    res.status(201).json({ message: 'Эмч амжилттай бүртгэгдлээ.', doctorId: result.insertId, tempPassword });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, specialization, phone, room_number, position_title, license_number, available_days, profile_image_url, experience_years, email } = req.body;
    const normalizedRoom = room_number === '' ? null : room_number;
    const normalizedTitle = position_title === '' ? null : position_title;

    const rows = await query('SELECT * FROM Doctor WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Эмч олдсонгүй.' });
    }
    const current = rows[0];

    await query(`
      UPDATE Doctor
      SET first_name = ?, last_name = ?, specialization = ?, phone = ?, room_number = ?, position_title = ?, license_number = ?, available_days = ?, profile_image_url = ?, experience_years = ?
      WHERE id = ?
    `, [
      first_name ?? current.first_name,
      last_name ?? current.last_name,
      specialization ?? current.specialization,
      phone ?? current.phone,
      normalizedRoom ?? current.room_number,
      normalizedTitle ?? current.position_title,
      license_number || current.license_number,
      available_days ?? current.available_days,
      profile_image_url ?? current.profile_image_url,
      experience_years ?? current.experience_years,
      id
    ]);

    if (email) {
      await query('UPDATE User SET email = ? WHERE id = ?', [email, current.user_id]);
    }

    res.json({ message: 'Эмчийн мэдээлэл шинэчлэгдлээ.' });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT user_id FROM Doctor WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Эмч олдсонгүй.' });
    }
    const userId = rows[0].user_id;
    await query('DELETE FROM Doctor WHERE id = ?', [id]);
    await query('DELETE FROM User WHERE id = ?', [userId]);
    res.json({ message: 'Эмч устгагдлаа.' });
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
      FROM Appointment a
      JOIN Patient p ON a.patient_id = p.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC
    `, [id]);

    res.json({ total: appointments.length, appointments });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updateDoctorPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: 'Нууц үг бага дорх 6 тэмдэгт байна.' });
    }

    const rows = await query('SELECT user_id FROM Doctor WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Эмч олдсонгүй.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await query('UPDATE User SET password = ?, must_change_password = ? WHERE id = ?', [hashedPassword, true, rows[0].user_id]);
    res.json({ message: 'Нууц үг амжилттай шинэчлэгдлээ.' });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};
