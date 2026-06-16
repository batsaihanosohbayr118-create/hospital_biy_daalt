import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from './database.js';

const usernameFromEmail = (email) => String(email || '').split('@')[0].slice(0, 50);
export const isGoogleAuthConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const trimTrailingSlash = (url) => String(url || '').replace(/\/$/, '');
const publicBackendUrl = trimTrailingSlash(
  process.env.PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  process.env.RENDER_EXTERNAL_URL
);
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL ||
  (publicBackendUrl
    ? `${publicBackendUrl}/api/auth/google/callback`
    : 'http://localhost:3000/api/auth/google/callback');

if (isGoogleAuthConfigured) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackUrl
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(new Error('Email олдсонгүй'), null);
      }

      let users = await query('SELECT * FROM User WHERE email = ?', [email]);

      if (users.length === 0) {
        const result = await query(
          'INSERT INTO User (email, username, password, role) VALUES (?, ?, ?, ?)',
          [email, usernameFromEmail(email), 'oauth_google', 'patient']
        );
        users = await query('SELECT * FROM User WHERE id = ?', [result.insertId]);
      }

      return done(null, users[0]);
    } catch (err) {
      console.error('Google OAuth алдаа:', err);
      return done(err, null);
    }
  }));
}

export default passport;
