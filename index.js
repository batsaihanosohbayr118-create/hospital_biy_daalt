import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getAllPatients, getPatientById, createPatient, updatePatient } from '../controllers/patientController.js';
import { getAllDoctors, getDoctorById, createDoctor, getDoctorAppointments } from '../controllers/doctorController.js';
import { createAppointment, getAllAppointments, updateAppointmentStatus, cancelAppointment } from '../controllers/appointmentController.js';
import { createPrescription, getPatientPrescriptions, createMedicalRecord, getPatientMedicalRecords } from '../controllers/medicalController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/patients',     authenticate, authorize('admin', 'doctor'), getAllPatients);
router.get('/patients/:id', authenticate, getPatientById);
router.post('/patients',    authenticate, authorize('admin'), createPatient);
router.put('/patients/:id', authenticate, authorize('admin', 'doctor'), updatePatient);

router.get('/doctors',                    authenticate, getAllDoctors);
router.get('/doctors/:id',                authenticate, getDoctorById);
router.get('/doctors/:id/appointments',   authenticate, authorize('admin', 'doctor'), getDoctorAppointments);
router.post('/doctors',                   authenticate, authorize('admin'), createDoctor);

router.post('/appointments',                  authenticate, createAppointment);
router.get('/appointments',                   authenticate, authorize('admin', 'doctor'), getAllAppointments);
router.put('/appointments/:id/status',        authenticate, authorize('admin', 'doctor'), updateAppointmentStatus);
router.delete('/appointments/:id',            authenticate, cancelAppointment);

router.post('/prescriptions',                      authenticate, authorize('doctor'), createPrescription);
router.get('/prescriptions/patient/:patientId',    authenticate, getPatientPrescriptions);

router.post('/medical-records',                       authenticate, authorize('doctor'), createMedicalRecord);
router.get('/medical-records/patient/:patientId',     authenticate, getPatientMedicalRecords);

export default router;