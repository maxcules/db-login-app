const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 4000), // TiDB default MySQL port
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "appdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
  } finally {
    conn.release();
  }
}

module.exports = { pool, testDbConnection };