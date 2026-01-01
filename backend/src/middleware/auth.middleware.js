const { findToken } = require("../models/token.model");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const [type, value] = header.split(" ");
  if (type !== "Bearer" || !value) return null;
  return value.trim();
}

async function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Missing Authorization Bearer token" });
  }

  const tokenRow = await findToken(token);
  if (!tokenRow) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Attach auth context
  req.auth = { userId: tokenRow.user_id, token };
  next();
}

module.exports = { requireAuth };