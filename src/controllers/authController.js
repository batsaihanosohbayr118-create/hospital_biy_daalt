import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export const register = async (req, res) => {
  try {
    const { email, username, password, role = 'patient' } = req.body;
    const loginName = username?.trim() || email?.split('@')[0] || null;

    const existing = await query('SELECT id FROM User WHERE email = ? OR username = ?', [email, loginName]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Энэ имэйл эсвэл нэвтрэх нэр аль хэдийн бүртгэлтэй байна.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO User (email, username, password, role) VALUES (?, ?, ?, ?)',
      [email, loginName, hashedPassword, role]
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
    const { email, username, password } = req.body;
    const identifier = (username || email || '').trim();

    const users = await query('SELECT * FROM User WHERE email = ? OR username = ?', [identifier, identifier]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Нэвтрэх нэр/имэйл эсвэл нууц үг буруу.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Нэвтрэх нэр/имэйл эсвэл нууц үг буруу.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Амжилттай нэвтэрлээ.',
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role, must_change_password: !!user.must_change_password }
    });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const rows = await query('SELECT id, email, username, role, must_change_password FROM User WHERE id = ? LIMIT 1', [req.user.id]);
    if (rows.length === 0) return res.json({ user: null });
    const user = rows[0];
    res.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role, must_change_password: !!user.must_change_password } });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const nextEmail = String(email || '').trim();
    const nextUsername = String(username || '').trim() || null;

    if (!nextEmail) {
      return res.status(400).json({ error: 'Имэйл заавал.' });
    }

    const existing = await query(
      'SELECT id FROM User WHERE (email = ? OR username = ?) AND id <> ? LIMIT 1',
      [nextEmail, nextUsername, req.user.id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Энэ имэйл эсвэл нэвтрэх нэр аль хэдийн ашиглагдаж байна.' });
    }

    if (password && String(password).length > 0) {
      if (String(password).length < 6) {
        return res.status(400).json({ error: 'Нууц үг багадаа 6 тэмдэгт байна.' });
      }
      const hashedPassword = await bcrypt.hash(String(password), 10);
      await query(
        'UPDATE User SET email = ?, username = ?, password = ?, must_change_password = ? WHERE id = ?',
        [nextEmail, nextUsername, hashedPassword, false, req.user.id]
      );
    } else {
      await query(
        'UPDATE User SET email = ?, username = ? WHERE id = ?',
        [nextEmail, nextUsername, req.user.id]
      );
    }

    const rows = await query('SELECT id, email, username, role, must_change_password FROM User WHERE id = ? LIMIT 1', [req.user.id]);
    const user = rows[0];
    res.json({
      message: 'Аккаунтын мэдээлэл шинэчлэгдлээ.',
      user: { id: user.id, email: user.email, username: user.username, role: user.role, must_change_password: !!user.must_change_password }
    });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { new_password } = req.body;
    if (!new_password || String(new_password).length < 6) {
      return res.status(400).json({ error: 'Нууц үг бага дорх 6 тэмдэгт байна.' });
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await query('UPDATE User SET password = ?, must_change_password = ? WHERE id = ?', [hashedPassword, false, req.user.id]);
    res.json({ message: 'Нууц үг шинэчлэгдлээ.' });
  } catch (err) {
    res.status(500).json({ error: 'Серверийн алдаа.', details: err.message });
  }
};
