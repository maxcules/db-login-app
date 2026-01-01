const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

/**
 * UPDATE demo: update a user's email
 * Body: { "email": "new@example.com" }
 */
router.put("/users/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { email } = req.body || {};

    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const [result] = await pool.query(
      "UPDATE users SET email = ? WHERE id = ?",
      [email, id]
    );

    // mysql2 returns affectedRows in result
    if (!result.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ ok: true, action: "UPDATE", userId: id, email });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    return next(err);
  }
});

/**
 * DELETE demo: delete a token row
 * You can grab a token from the /login response and delete it here.
 */
router.delete("/tokens/:token", async (req, res, next) => {
  try {
    const token = String(req.params.token || "").trim();
    if (!token || token.length < 10) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const [result] = await pool.query(
      "DELETE FROM tokens WHERE token = ?",
      [token]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Token not found" });
    }

    return res.json({ ok: true, action: "DELETE", token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;