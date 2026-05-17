import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') }); 

const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;
const parsedUrl = databaseUrl ? new URL(databaseUrl) : null;

const pool = mysql.createPool({
  host: parsedUrl?.hostname || process.env.DB_HOST || 'localhost',
  port: Number(parsedUrl?.port || process.env.DB_PORT || 3306),
  user: parsedUrl ? decodeURIComponent(parsedUrl.username) : process.env.DB_USER || 'root',
  password: parsedUrl ? decodeURIComponent(parsedUrl.password) : process.env.DB_PASSWORD || '',
  database: parsedUrl?.pathname ? decodeURIComponent(parsedUrl.pathname.slice(1)) : process.env.DB_NAME || 'hospital_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export default pool;
