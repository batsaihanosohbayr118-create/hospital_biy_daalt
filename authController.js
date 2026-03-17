import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { email, password, role = 'patient' } = req.body;

    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Энэ имэйл аль хэдийн бүртгэлтэй байна.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );

    res.status(201).json({
      message: 'Хэрэглэгч амжилттай бүртгэгдлээ.',
      userId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Амжилттай нэвтэрлээ.',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};