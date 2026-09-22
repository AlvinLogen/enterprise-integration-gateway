import sql from "mssql";
import { loadEnv } from "../config/env.js";

let pool;

export async function openPool() {
  if (pool) return pool;

  const env = loadEnv();
  pool = await new sql.ConnectionPool({
    server: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    options: {
      encrypt: env.DB_ENCRYPT,
      trustServerCertificate: env.DB_TRUST_CERT,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  }).connect();

  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.close();
    pool = undefined;
  }
}

export { sql };
