import { buildSchema } from 'graphql';
import { query } from '../config/database.js';

export const schema = buildSchema(`
  type Doctor {
    id: ID!
    first_name: String!
    last_name: String!
    specialization: String!
    phone: String
    available_days: String
    appointments: [Appointment]
  }

  type Patient {
    id: ID!
    first_name: String!
    last_name: String!
    date_of_birth: String!
    gender: String!
    blood_type: String
    appointments: [Appointment]
    prescriptions: [Prescription]
  }

  type Appointment {
    id: ID!
    appointment_date: String!
    status: String!
    notes: String
    doctor: Doctor
    patient: Patient
  }

  type Prescription {
    id: ID!
    medication: String!
    dosage: String!
    duration: String!
    instructions: String
    issued_at: String
  }

  type Query {
    doctor(id: ID!): Doctor
    doctors: [Doctor]
    patient(id: ID!): Patient
    patients: [Patient]
    appointment(id: ID!): Appointment
    appointments(status: String): [Appointment]
  }
`);

export const rootValue = {
  doctor: async ({ id }) => {
    const doctors = await query('SELECT * FROM doctors WHERE id = ?', [id]);
    if (!doctors.length) return null;
    const doctor = doctors[0];

    doctor.appointments = async () => {
      return await query(`
        SELECT a.*, p.first_name, p.last_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_date DESC
      `, [id]);
    };

    return doctor;
  },

  doctors: async () => {
    const doctors = await query('SELECT * FROM doctors ORDER BY last_name');
    return doctors.map(d => ({
      ...d,
      appointments: async () => await query(
        'SELECT * FROM appointments WHERE doctor_id = ?', [d.id]
      )
    }));
  },

  patient: async ({ id }) => {
    const patients = await query('SELECT * FROM patients WHERE id = ?', [id]);
    if (!patients.length) return null;
    const patient = patients[0];

    patient.appointments = async () => {
      return await query(
        'SELECT * FROM appointments WHERE patient_id = ? ORDER BY appointment_date DESC',
        [id]
      );
    };

    patient.prescriptions = async () => {
      return await query(
        'SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY issued_at DESC',
        [id]
      );
    };

    return patient;
  },

  patients: async () => {
    return await query('SELECT * FROM patients ORDER BY last_name');
  },

  appointment: async ({ id }) => {
    const appointments = await query('SELECT * FROM appointments WHERE id = ?', [id]);
    return appointments[0] || null;
  },

  appointments: async ({ status }) => {
    if (status) {
      return await query('SELECT * FROM appointments WHERE status = ?', [status]);
    }
    return await query('SELECT * FROM appointments ORDER BY appointment_date DESC');
  }
};
