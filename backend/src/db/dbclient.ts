import * as dotenv from "dotenv";
import mysql, { Pool } from "mysql2/promise";

// Lade Umgebungsvariablen aus .env
dotenv.config();
let pool: Pool | null = null;

// Wrapper für den Zugriff auf den Pool
export const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  };
  return pool.getConnection();
}
// Funktion zum Schließen des Pools (optional)
export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
