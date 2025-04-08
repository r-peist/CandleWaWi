import mysql, { Pool } from "mysql2/promise";

let pool: Pool | null = null;

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
  }
  return pool.getConnection();
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
