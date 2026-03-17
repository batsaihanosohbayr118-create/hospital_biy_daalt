import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config();

const tableMap = [
  ['user', 'users'],
  ['patient', 'patients'],
  ['doctor', 'doctors'],
  ['appointment', 'appointments'],
  ['prescription', 'prescriptions'],
  ['medicalrecord', 'medical_records']
];

const run = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hospital_db'
  });

  const [rows] = await conn.query('SHOW TABLES');
  const existing = new Set(rows.map(r => Object.values(r)[0]));

  for (const [oldName, newName] of tableMap) {
    if (existing.has(oldName) && !existing.has(newName)) {
      await conn.query('RENAME TABLE ?? TO ??', [oldName, newName]);
      console.log(`Renamed ${oldName} -> ${newName}`);
      existing.delete(oldName);
      existing.add(newName);
    }
  }

  await conn.end();
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
