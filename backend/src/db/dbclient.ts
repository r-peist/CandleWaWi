import * as dotenv from "dotenv";
import mysql, { Pool } from "mysql2/promise";

// Lade Umgebungsvariablen aus .env
dotenv.config();

// Pool erstellen
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Wrapper für den Zugriff auf den Pool
export const getConnection = async () => {
  return pool.getConnection();
};

// Funktion zum Schließen des Pools (optional)
export const closePool = async () => {
  await pool.end();
};
