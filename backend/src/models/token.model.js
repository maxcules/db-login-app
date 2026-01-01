const { pool } = require("../config/db");

async function createToken({ token, userId }) {
  await pool.query(
    "INSERT INTO tokens (token, user_id, created_at) VALUES (?, ?, NOW())",
    [token, userId]
  );
}

async function findToken(token) {
  const [rows] = await pool.query(
    "SELECT token, user_id, created_at FROM tokens WHERE token = ? LIMIT 1",
    [token]
  );
  return rows[0] || null;
}

async function deleteToken(token) {
  await pool.query("DELETE FROM tokens WHERE token = ?", [token]);
}

module.exports = { createToken, findToken, deleteToken };