import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { query } from './database.js';
import jwt from 'jsonwebtoken';

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  'http://localhost:3000/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      if (!email) {
        return done(new Error('Email олдсонгүй'), null);
      }

      let users = await query('SELECT * FROM User WHERE email = ?', [email]);
      
      if (users.length === 0) {
        const result = await query(
          'INSERT INTO User (email, password, role) VALUES (?, ?, ?)',
          [email, 'oauth_google', 'patient']
        );
        users = await query('SELECT * FROM User WHERE id = ?', [result.insertId]);
      }
      
      return done(null, users[0]);
    } catch(err) { 
      console.error('Google OAuth алдаа:', err);
      return done(err, null); 
    }
  }));
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID:     process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL:  'http://localhost:3000/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || `fb_${profile.id}@facebook.com`;
      let users = await query('SELECT * FROM User WHERE email = ?', [email]);
      
      if (users.length === 0) {
        const result = await query(
          'INSERT INTO User (email, password, role) VALUES (?, ?, ?)',
          [email, 'oauth_facebook', 'patient']
        );
        users = await query('SELECT * FROM User WHERE id = ?', [result.insertId]);
      }
      
      return done(null, users[0]);
    } catch(err) { return done(err, null); }
  }));
}

export default passport;
