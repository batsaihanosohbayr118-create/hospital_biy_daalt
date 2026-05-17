import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { isGoogleAuthConfigured } from '../config/passport.js';
import { register, login, getMe, updateMe, changePassword } from '../controllers/authController.js';
import {
  getAllPatients,
  getMyPatientProfile,
  getPatientById,
  createPatient,
  updateMyPatientProfile,
  updatePatient
} from '../controllers/patientController.js';
import {
  getAllDoctors,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  getDoctorById,
  createDoctor,
  getDoctorAppointments,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateDoctor,
  deleteDoctor,
  updateDoctorPassword
} from '../controllers/doctorController.js';
import {
  createAppointment,
  getAllAppointments,
  getDoctorBookedSlots,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { createPrescription, getAllPrescriptions, getMyPrescriptions, getPatientPrescriptions, createMedicalRecord, getPatientMedicalRecords } from '../controllers/medicalController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
const rawFrontendUrl = process.env.FRONTEND_URL || 'https://hospitalbiydaalt.vercel.app';
const frontendUrl = (
  process.env.RENDER && rawFrontendUrl.includes('localhost')
    ? 'https://hospitalbiydaalt.vercel.app'
    : rawFrontendUrl
).replace(/\/$/, '');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);
router.put('/auth/me', authenticate, updateMe);
router.put('/auth/change-password', authenticate, changePassword);

router.get('/dashboard/stats', authenticate, authorize('admin', 'doctor', 'patient'), getDashboardStats);

// Google OAuth
router.get('/auth/google', (req, res, next) => {
  if (!isGoogleAuthConfigured) {
    return res.redirect(`${frontendUrl}/?error=google_oauth_not_configured`);
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/auth/google/callback',
  (req, res, next) => {
    if (!isGoogleAuthConfigured) {
      return res.redirect(`${frontendUrl}/?error=google_oauth_not_configured`);
    }
    return passport.authenticate('google', {
      failureRedirect: `${frontendUrl}/?error=google_oauth_failed`,
      session: false
    })(req, res, next);
  },
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const user = encodeURIComponent(JSON.stringify({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      must_change_password: !!req.user.must_change_password
    }));
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${user}`);
  }
);

router.get('/patients/me',  authenticate, authorize('patient'), getMyPatientProfile);
router.put('/patients/me',  authenticate, authorize('patient'), updateMyPatientProfile);
router.get('/doctors/me',   authenticate, authorize('doctor'), getMyDoctorProfile);
router.put('/doctors/me',   authenticate, authorize('doctor'), updateMyDoctorProfile);
router.get('/patients',     authenticate, authorize('admin', 'doctor'), getAllPatients);
router.get('/patients/:id', authenticate, authorize('admin', 'doctor'), getPatientById);
router.post('/patients',    authenticate, authorize('admin'), createPatient);
router.put('/patients/:id', authenticate, authorize('admin', 'doctor'), updatePatient);

router.get('/departments',                authenticate, authorize('admin', 'doctor', 'patient'), getDepartments);
router.post('/departments',               authenticate, authorize('admin'), createDepartment);
router.put('/departments/:name',          authenticate, authorize('admin'), updateDepartment);
router.delete('/departments/:name',       authenticate, authorize('admin'), deleteDepartment);
router.get('/doctors',                    authenticate, authorize('admin', 'doctor', 'patient'), getAllDoctors);
router.get('/doctors/:id',                authenticate, authorize('admin', 'doctor', 'patient'), getDoctorById);
router.get('/doctors/:id/appointments',   authenticate, authorize('admin', 'doctor'), getDoctorAppointments);
router.post('/doctors',                   authenticate, authorize('admin'), createDoctor);
router.put('/doctors/:id',                authenticate, authorize('admin'), updateDoctor);
router.delete('/doctors/:id',             authenticate, authorize('admin'), deleteDoctor);
router.put('/doctors/:id/password',       authenticate, authorize('admin'), updateDoctorPassword);

router.post('/appointments',                  authenticate, authorize('patient'), createAppointment);
router.get('/appointments/me',                authenticate, authorize('patient'), getMyAppointments);
router.get('/appointments/doctor/:doctorId',  authenticate, authorize('patient', 'admin', 'doctor'), getDoctorBookedSlots);
router.get('/appointments',                   authenticate, authorize('admin', 'doctor'), getAllAppointments);
router.put('/appointments/:id/status',        authenticate, authorize('admin', 'doctor'), updateAppointmentStatus);
router.delete('/appointments/:id',            authenticate, authorize('patient'), cancelAppointment);

router.post('/prescriptions',                      authenticate, authorize('doctor'), createPrescription);
router.get('/prescriptions',                       authenticate, authorize('admin', 'doctor'), getAllPrescriptions);
router.get('/prescriptions/me',                    authenticate, authorize('patient'), getMyPrescriptions);
router.get('/prescriptions/patient/:patientId',    authenticate, authorize('admin', 'doctor'), getPatientPrescriptions);

router.post('/medical-records',                       authenticate, authorize('doctor'), createMedicalRecord);
router.get('/medical-records/patient/:patientId',     authenticate, authorize('admin', 'doctor'), getPatientMedicalRecords);

export default router;
