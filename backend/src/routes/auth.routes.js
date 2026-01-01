const express = require("express");
const { login } = require("../services/auth.service");
const logger = require("../config/logger");

const router = express.Router();

function getClientIp(req) {
  // Works behind reverse proxy too (later with Docker/nginx)
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  // Basic validation
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!password || typeof password !== "string" || password.length < 4) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const result = await login(email, password);

  if (!result.ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // REQUIRED: log login in JSON format to console via log4js
  logger.info(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      userId: result.user.id,
      action: "LOGIN",
      ip: getClientIp(req)
    })
  );

  return res.json({
    token: result.token,
    user: result.user
  });
});

module.exports = router;